"""Ink-format episodes for Story_time10 (the look approved from pilot_sleep.py).

    python ink_episode.py sleep --props      voice + timings only (for stills)
    python ink_episode.py sleep              voice + render + music + mix
    python ink_episode.py sleep --reuse      re-render with the voice already made

An episode is a module in episodes/ with LINES = [(text, kind, shot-or-None)],
FACTS = {wikipedia title: [exact phrases]} and META (title/description/tags).
A shot is plain data the Remotion side (remotion/src/ink/Episode.tsx) draws: a
background, the cast, props, tags. A line without a shot continues the one
before. Voice takes are cached by text, so a re-run only re-speaks changed lines.
"""
import asyncio
import hashlib
import importlib
import json
import subprocess
import sys
import wave
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
import mix  # noqa: E402
import score  # noqa: E402
import wiki  # noqa: E402

VOICE = "en-US-BrianMultilingualNeural"   # config.yaml tts.voice
GAP = 0.42
DELIVERY = {"hook": ("+2%", "+0Hz"), "walk": ("+4%", "+0Hz"), "cold": ("-2%", "-3Hz"), "question": ("+2%", "+3Hz"),
            "reveal": ("-2%", "-2Hz"), "stop": ("-6%", "-3Hz"), "payoff": ("-4%", "-2Hz"), "cta": ("+3%", "+2Hz")}


def check_facts(facts):
    for title, texts in facts.items():
        page = wiki.page(title)["text"].lower()
        for text in texts:
            if text.lower() not in page:
                raise SystemExit(f"Wikipedia '{title}' no longer says '{text}' - check the script")


async def _speak(text, kind, mp3):
    rate, pitch = DELIVERY.get(kind, DELIVERY["walk"])
    for attempt in range(3):
        try:
            await asyncio.wait_for(edge_tts.Communicate(text, VOICE, rate=rate, pitch=pitch).save(str(mp3)), 45)
            return
        except Exception:
            if attempt == 2:
                # edge-tts refuses some exact sentences every time (2026-10-04) - reword the line
                raise SystemExit(f"the free voice keeps refusing this line - reword it: {text!r}")
            await asyncio.sleep(4 * (attempt + 1))


def voice(lines, job):
    takes = job / "takes"
    takes.mkdir(parents=True, exist_ok=True)
    vo, t, frames = [], 0.0, []
    for i, (text, kind) in enumerate(lines, 1):
        key = hashlib.sha1(f"{VOICE}|{kind}|{text}".encode()).hexdigest()[:12]
        mp3, wav_ = takes / f"{key}.mp3", takes / f"{key}.wav"
        if not wav_.exists():
            asyncio.run(_speak(text, kind, mp3))
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(mp3), "-af",
                            "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                            "silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                            "-ar", "48000", "-ac", "1", str(wav_)], check=True)
        with wave.open(str(wav_)) as w:
            data = w.readframes(w.getnframes())
            d = w.getnframes() / w.getframerate()
        vo.append({"text": text, "start": round(t, 3), "end": round(t + d, 3)})
        frames.append(data)
        t += d + GAP
        print(f"  [{i:02d}] {d:4.1f}s  {text[:64]}")
    raw = job / "voice_raw.wav"
    with wave.open(str(raw), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(48000)
        w.writeframes((b"\x00\x00" * int(48000 * GAP)).join(frames))
    out = job / "voice.mp3"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af",
                    "highpass=f=80,equalizer=f=3000:t=q:w=1.2:g=2,loudnorm=I=-16:TP=-1.5:LRA=7",
                    "-ar", "48000", "-b:a", "192k", str(out)], check=True)
    return vo, out


def main():
    slug = sys.argv[1]
    js = ROOT / "episodes" / f"{slug}.json"
    if js.exists():
        # an episode written by Gemini (gemini_episode.py)
        d = json.loads(js.read_text(encoding="utf-8"))
        from types import SimpleNamespace
        ep = SimpleNamespace(FACTS=d["facts"], LINES=[(l["text"], l.get("kind", "walk"), l.get("shot")) for l in d["lines"]], INTRO=None,
                             META={"title": d["title"], "description": d["description"], "tags": d.get("tags", [])},
                             THUMB=d.get("thumb"))
    else:
        ep = importlib.import_module(f"episodes.{slug}")
    if "--test-no-facts" not in sys.argv:          # only for judging a draft's look - never for posting
        check_facts(ep.FACTS)
    job = ROOT / "output" / f"ink_{slug}"
    job.mkdir(parents=True, exist_ok=True)
    props_path = job / "props.json"
    lines = [(t, k) for t, k, _ in ep.LINES]
    if "--reuse" in sys.argv and props_path.exists():
        vo = json.loads(props_path.read_text(encoding="utf-8"))["vo"]
        if [v["text"] for v in vo] != [t for t, _ in lines]:
            raise SystemExit("the script changed since the voice was made - run without --reuse")
        voice_mp3 = job / "voice.mp3"
    else:
        vo, voice_mp3 = voice(lines, job)
    secs = round(vo[-1]["end"] + 1.8, 2)
    shots, cur = [], None
    for i, (_, _, shot) in enumerate(ep.LINES):
        if shot is not None:
            cur = {**shot, "from": i}
            shots.append(cur)
    props = {"vo": vo, "shots": shots, "intro": getattr(ep, "INTRO", None), "durationInSeconds": secs}
    props_path.write_text(json.dumps(props), encoding="utf-8")
    print(f"[props ] {len(vo)} lines, {len(shots)} shots, {secs / 60:.1f} min")
    if "--props" in sys.argv:
        return
    silent = job / "silent.mp4"
    subprocess.run(["node", "render-ink.mjs", "InkEpisode", str(props_path), str(silent)], cwd=ROOT / "remotion", check=True)
    bed = job / "score.wav"
    score.build_score(bed, secs + 0.5, tone="calm", seed=96)
    out = job / f"{slug}.mp4"
    mix.mix(silent, voice_mp3, bed, out, bed_db=-13)
    (job / "meta.json").write_text(json.dumps(ep.META, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[done  ] {out}  ({mix.duration(out) / 60:.1f} min)")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
