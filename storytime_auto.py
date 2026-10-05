"""Story_time10 on autopilot: one Gemini-made ink episode every 2 days.

Run once a day (Windows Task Scheduler "StoryTimeInk", storytime_auto.bat):
  day 1 - WRITE: Gemini picks a topic, researches it from Wikipedia, writes the episode, draws every object
          the narrator names (gemini_episode.py), then LOOKS at stills of its own episode and fixes weak shots.
  day 2 - MAKE:  voice, render, thumbnail, upload scheduled public at 20:45 Nepal time (15:00 UTC).
State lives in data/ink_state.json. A day whose step fails is logged and retried the next day.

    python storytime_auto.py            do today's step
    python storytime_auto.py --status   show the state
"""
import json
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
STATE = ROOT / "data" / "ink_state.json"
PY = sys.executable


def load():
    return json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {"pending": None, "posted": []}


def save(st):
    STATE.write_text(json.dumps(st, indent=1), encoding="utf-8")


def run(*args):
    print(f"[run   ] {' '.join(args)}", flush=True)
    r = subprocess.run([PY, *args], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print(r.stdout[-3000:], r.stderr[-3000:], flush=True)
    if r.returncode:
        raise SystemExit(f"step failed: {' '.join(args)}")
    return r.stdout


def stills(slug, lines):
    out = ROOT / "remotion" / "out" / f"ink_{slug}"
    subprocess.run(["node", "_stills.mjs", ",".join(str(i) for i in lines), f"ink_{slug}", "InkEpisode"],
                   cwd=ROOT / "remotion", check=True, capture_output=True)
    from PIL import Image, ImageDraw
    ims = [(i, Image.open(out / f"{i}.jpg")) for i in lines if (out / f"{i}.jpg").exists()]
    w, h = ims[0][1].size
    sheet = Image.new("RGB", (w * 4, (h + 26) * ((len(ims) + 3) // 4)), "white")
    d = ImageDraw.Draw(sheet)
    for k, (i, im) in enumerate(ims):
        x, y = (k % 4) * w, (k // 4) * (h + 26)
        sheet.paste(im, (x, y + 26))
        d.text((x + 6, y + 6), f"LINE {i}", fill="black")
    path = out / "review.jpg"
    sheet.save(path, quality=80)
    return path


def self_review(slug):
    """Gemini looks at stills of its own episode and rewrites the shots that don't show what is said."""
    from google.genai import types
    import gemini_episode as ge
    from src import llm
    from src.cfg import load as load_cfg
    cfg = load_cfg()
    js = ROOT / "episodes" / f"{slug}.json"
    ep = json.loads(js.read_text(encoding="utf-8"))
    n = len(ep["lines"])
    for part in range(0, n, 16):                      # 16 stills per look, so they stay big enough to judge
        idx = list(range(part, min(n, part + 16)))
        run("ink_episode.py", slug, "--props")
        sheet = stills(slug, idx)
        text = "\n".join(f"LINE {i}: \"{ep['lines'][i]['text']}\"  shot: {json.dumps(ep['lines'][i].get('shot'), ensure_ascii=False)[:600]}"
                         for i in idx)
        prompt = (ge.FORMAT + "\nYou are the director checking frames of your own episode (picture = mid-line frame of each LINE). "
                  "For each line, is the thing the narrator names clearly on screen? Are people's faces covered, drawings tiny or "
                  "unreadable, shots empty (just a label), backgrounds wrong for the time/place (e.g. a modern town for a stone-age "
                  "feast)? Rewrite ONLY the shots that need it (whole shot objects, same format; use \"draw\" props with \"what\" for new "
                  'objects). Return JSON {"fixes": [{"line": n, "shot": {...}}], "notes": "one line"}.\n\nLINES:\n' + text)
        client, models = llm.client_models(cfg)
        contents = [types.Part.from_bytes(data=sheet.read_bytes(), mime_type="image/jpeg"), prompt]
        try:
            res = json.loads(llm._strip_fences(llm._run(client, models, contents,
                                                         types.GenerateContentConfig(response_mime_type="application/json", temperature=0.4))))
        except Exception as e:
            print(f"[review] skipped this part ({type(e).__name__}: {str(e)[:120]})")
            continue
        fixes = [f for f in res.get("fixes", []) if isinstance(f, dict) and isinstance(f.get("shot"), dict)
                 and 0 <= int(f.get("line", -1)) < n]
        for f in fixes:
            ep["lines"][int(f["line"])]["shot"] = f["shot"]
        print(f"[review] lines {idx[0]}-{idx[-1]}: {len(fixes)} shots rewritten - {str(res.get('notes', ''))[:160]}")
        ge.illustrate(cfg, ep)
        ge.tidy_layout(ep)
        js.write_text(json.dumps(ep, indent=1, ensure_ascii=False), encoding="utf-8")


def write_day(st):
    out = run("gemini_episode.py")
    slug = out.strip().splitlines()[-1].strip()
    if not (ROOT / "episodes" / f"{slug}.json").exists():
        raise SystemExit(f"no episode file for '{slug}'")
    self_review(slug)
    st["pending"] = {"slug": slug, "written": datetime.now(timezone.utc).isoformat()}
    save(st)
    print(f"[write ] {slug} written and reviewed - it will be made and posted tomorrow")


def make_day(st):
    slug = st["pending"]["slug"]
    run("ink_episode.py", slug)
    ep = json.loads((ROOT / "episodes" / f"{slug}.json").read_text(encoding="utf-8"))
    top, bottom = (ep.get("thumb") or ["ANCIENT", "HUMANS?"])[:2]
    svgs = [p["svg"] for l in ep["lines"] for p in (l.get("shot") or {}).get("props", []) if p.get("k") == "svg" and p.get("svg")]
    props = {"top": top, "bottom": bottom, **({"svg": svgs[len(svgs) // 3]} if svgs else {})}
    pj = ROOT / "output" / f"ink_{slug}" / "thumb_props.json"
    pj.write_text(json.dumps(props), encoding="utf-8")
    subprocess.run(["node", "thumb-ink.mjs", str(ROOT / "output" / f"ink_{slug}" / "thumb.jpg"), "--props", str(pj)],
                   cwd=ROOT / "remotion", check=True)
    now = datetime.now(timezone.utc)
    at = now.replace(hour=15, minute=0, second=0, microsecond=0)
    if at < now + timedelta(minutes=30):
        at += timedelta(days=1)
    out = run("ink_upload.py", slug, "--at", at.strftime("%Y-%m-%dT%H:%MZ"))
    st["posted"].append({"slug": slug, "at": at.isoformat(), "log": out.strip().splitlines()[-1]})
    st["pending"] = None
    save(st)


def main():
    st = load()
    if "--status" in sys.argv:
        print(json.dumps(st, indent=1))
        return
    print(f"===== {datetime.now():%Y-%m-%d %H:%M} =====", flush=True)
    if st.get("pending"):
        make_day(st)
    else:
        write_day(st)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
