"""Automation test: Gemini writes a whole ink episode (topic, script, Wikipedia
facts, every shot) in the format of episodes/sleep.py; nothing is hand-fixed.

    python gemini_episode.py            -> episodes/<slug>.json, then: python ink_episode.py <slug>

Facts are checked against Wikipedia exactly like a hand-made episode; failures go
back to Gemini (with the article text) twice, then the build stops.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
import wiki  # noqa: E402
from episodes import sleep  # noqa: E402
from src import llm  # noqa: E402
from src.cfg import load as load_cfg  # noqa: E402

FORMAT = """
You write episodes for "Story_time10", an animated YouTube channel: curious, warm, slightly funny questions about how
ancient/early humans lived, told as a story with real archaeology and science. 1920x1080, hand-drawn ink cartoon look.
Each line of narration is spoken by a narrator (short sentences, easy to say, no lists).

OUTPUT: one JSON object:
{"slug": "snake_case_short", "title": "YouTube title (a question, under 70 chars)",
 "thumb": ["TOP WORD(S)", "BOTTOM?"],  // 2 short lines for the thumbnail, max 10 chars each
 "description": "YouTube description: 2-line hook, then '- ' bullet facts, then a question for comments, then hashtags",
 "tags": ["..."],
 "facts": {"Exact English Wikipedia article title": ["exact phrase copied word for word from that article", ...]},
 "lines": [{"text": "...", "kind": "hook|walk|cold|question|reveal|stop|payoff|cta", "shot": {...} or null}]}

RULES
- 45 to 60 lines, ~650-850 words. Line 1 is a curiosity hook. Split into 4-5 parts, each starting with a shot that has
  "chapter": "PART n · NAME". End with a modern mirror and a final "Subscribe..." line (kind "cta").
- EVERY number, date, name and claim must be backed by an exact phrase in "facts" (copy the article's wording exactly,
  8-25 words each; they are checked by string match, case-insensitive). If you are not sure an article says it, cut it.
- A line with "shot": null continues the previous shot. Give a new shot at least every 1-3 lines. Vary backgrounds.

SHOT FORMAT (only these names work; anything else is not drawn)
 bg: paper | night | dusk | savanna-night | cave-night | lab | lab-dark | room-night | town-night | village-night
 chapter: "PART 1 · ..."   zoom: [from, to] e.g. [1.0, 1.06] (never below 1.0)   focus: [x, y]   glow: true (firelight)
 actors: [{"who": dad|mom|kid|elder|hominin|hominin2|scientist|volunteer|scholar|thief|noble|noble2|modern,
           "x": 200-1720, "y": 930-1000 (feet on the ground), "s": 0.9-1.4,
           "pose": stand|sit|wave|point|scared|feed|pray|play|write|sneak|walk|drink|sitbed|think,
           "mood": neutral|worried|happy|sleepy|wow|scared, "look": -1|0|1, "flip": true|false, "lie": true (lying down),
           "ghost": true, "to": [x, y], "move": [a, b], "then": {"at": 0.6, "mood": "...", "pose": "..."}, "talk": [a, b], "at": 0.3}]
 props: [{"k": KIND, "x", "y", "s", "at", ...}] KIND and extra keys:
   fire (grow:[a,b], min, max) | mound (grass bed) | eyes (fade:[a,b]) | cat (to:[x,y], move:[a,b], sabre, still, flip) |
   cateyes | bones (burnt) | sleepbar (blocks:[["sleep",0.46],["awake",0.08],...], grow:[a,b], labels, fade, squeeze) |
   clock (dark: hours of 24, or time: hour) | calendar (text, or flip:["A","B"]) | bed | zzz | question (from:[x,y]) |
   think (from) | dream (from) | speech (from, icon: cat|spear|faces) | book | candle | desk | hut | magnifier |
   clue (text "1") | flute (holes:[a,b]) | notes | notchbone (carve:[a,b], count) | moonrow | rock | moon | streetlamp (light: a) |
   clipboard | subscribe |
   draw ("what": "a wooden toothpick" - ANY object the list lacks; an illustrator draws it big in the ink style;
         put it at x 700-1300, y 450-650, "s": 1.0-1.6, and time it with "word")
 tags: [{"text": "SHORT LABEL", "x", "y": 120-300 (top) or 780-950, "at", "size": 36-64, "rot": -4..4, "color": "red"|"blue"}]
 big: {"text": "BIG HEADLINE", "sub": "...", "at", "y": 150-260, "size": 80-120}
 Times (at, move, grow, ...) are 0..1 of the shot; add "line": n to time an element inside the n-th line of that shot.
 "word": "toothpick" on an actor/prop/tag makes it appear exactly when the narrator says that word (add "line": n if the
 word is in a later line of the same shot) - USE THIS for every thing the narrator names.
 Keep people's feet near y=950, keep tags off faces, max 3 actors per shot, put the scene's main idea on screen.

EVERY SHOT must show a person (actors) or a big object (a library prop or a draw); a shot with only a tag or text is NOT allowed.
SHOW WHAT IS SAID (most important): every concrete thing the narrator names - an object, tool, animal, body part, food,
plant, place, number - must be ON SCREEN at the moment it is said, big and clear: a library prop if one fits, else a "draw"
prop, timed with "word". A number gets a tag or big headline when it is said. Never leave a line with nothing new.
"""

DONE = ["When Did Ancient Humans Start Drinking Alcohol?", "What Did Ancient Humans Actually Do All Day?",
        "The Disturbing Ways Ancient Humans Survived Winter", "What Did Ancient Humans Do When It Rained All Week?",
        "How Did Ancient Humans Travel the World?", "Why Are We the Only Human Species Left?", "What Did Ancient Humans Do For Pleasure?",
        "How Did Ancient Humans Survive the Deadliest Predators on Earth?", "When Did Ancient Humans Start Smoking Weed?",
        "What did Early Humans do when they got Sick", "The Real Reason Humans Started Wearing Clothes"]


def example():
    rows = [{"text": t, "kind": k, "shot": s} for t, k, s in sleep.LINES[12:40]]
    return json.dumps(rows, ensure_ascii=False)


ILLUSTRATOR = """You are the illustrator of a hand-drawn ink cartoon channel. Draw each requested object as SVG for a 400x400 box.
STYLE: like a children's picture book doodle. Fill the box: the object spans roughly 60-360 on its long side, centred on 200,200.
Every shape: stroke="#2a2320" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" and a flat fill from
#d9a14e #b9553a #93a878 #a9c4cf #e8dcbc #f3ead8 #6f9a52 #8c7a68 #ff9a3d #ffcf6a #3a4357 #f4f1ea #c9b25e #7a5638.
Use 6-20 shapes (paths, ellipses, rects) with a few interior detail lines (stroke-width 3-4, no fill) so it reads clearly.
NO text, NO gradients, NO filters, NO images, NO <svg> wrapper - return only a <g>...</g> per object.
EXAMPLE 1 (a bone flute):
<g><path d="M40 170 Q30 200 40 230 L360 222 Q372 200 360 178 Z" fill="#e8dcbc" stroke="#2a2320" stroke-width="7" stroke-linejoin="round"/>
<path d="M70 190 Q200 182 340 188" fill="none" stroke="#2a2320" stroke-width="3"/><ellipse cx="130" cy="200" rx="13" ry="10" fill="#2a2320"/>
<ellipse cx="185" cy="200" rx="13" ry="10" fill="#2a2320"/><ellipse cx="240" cy="200" rx="13" ry="10" fill="#2a2320"/>
<ellipse cx="295" cy="200" rx="13" ry="10" fill="#2a2320"/></g>
EXAMPLE 2 (a clay pot with water):
<g><path d="M110 120 L290 120 L275 150 Q340 210 300 300 Q270 350 200 352 Q130 350 100 300 Q60 210 125 150 Z" fill="#b9553a"
stroke="#2a2320" stroke-width="7" stroke-linejoin="round"/><ellipse cx="200" cy="122" rx="92" ry="20" fill="#a9c4cf" stroke="#2a2320"
stroke-width="7"/><path d="M120 220 Q200 240 280 220 M115 260 Q200 282 285 260" fill="none" stroke="#2a2320" stroke-width="4"/></g>
Return JSON {"drawings": {"<exact request text>": "<g>...</g>", ...}} for every request."""


def ask(cfg, prompt, temperature):
    """run_json, retried: long answers sometimes come back as broken JSON."""
    for attempt in range(3):
        try:
            return llm.run_json(cfg, prompt, temperature=temperature)
        except json.JSONDecodeError as e:
            print(f"[gemini] broken JSON ({e.msg}) - asking again")
    raise SystemExit("Gemini kept returning broken JSON")


def illustrate(cfg, ep):
    """Turn every {"k": "draw", "what": ...} prop into an {"k": "svg"} drawing."""
    wants = sorted({p["what"] for l in ep["lines"] if l.get("shot") for p in l["shot"].get("props", []) if p.get("k") == "draw" and p.get("what")})
    if not wants:
        return
    got = {}
    for k in range(0, len(wants), 8):      # a few at a time keeps each drawing careful
        batch = wants[k:k + 8]
        res = ask(cfg, ILLUSTRATOR + "\n\nREQUESTS:\n" + "\n".join(f"- {w}" for w in batch), temperature=0.6)
        got.update(res.get("drawings", {}))
    n = 0
    for l in ep["lines"]:
        for p in (l.get("shot") or {}).get("props", []):
            if p.get("k") == "draw":
                svg = got.get(p.get("what", ""))
                p["k"], p["svg"] = ("svg", svg) if svg else ("none", "")
                n += bool(svg)
    print(f"[draw  ] {n} drawings for {len(wants)} objects: {wants}")


def tidy_layout(ep):
    """Gemini often drops a drawing right on a character's face: slide it beside them, and keep drawings big."""
    moved = 0
    for l in ep["lines"]:
        shot = l.get("shot") or {}
        people = [a for a in shot.get("actors", []) if not a.get("lie")]
        for p in shot.get("props", []):
            if p.get("k") != "svg":
                continue
            p["s"] = max(float(p.get("s", 1.0)), 1.3)
            for a in people:
                if abs(float(p.get("x", 960)) - float(a.get("x", 960))) < 330:
                    p["x"] = float(a["x"]) + 480 if float(a["x"]) < 960 else float(a["x"]) - 480
                    p["y"] = 560
                    moved += 1
                    break
    print(f"[layout] moved {moved} drawings off faces")


def bad_facts(facts):
    bad = {}
    for title, phrases in facts.items():
        try:
            text = wiki.page(title)["text"].lower()
        except Exception:
            bad[title] = {"missing_article": True, "phrases": phrases}
            continue
        miss = [p for p in phrases if p.lower() not in text]
        if miss:
            bad[title] = {"phrases": miss}
    return bad


def main():
    cfg = load_cfg()
    # 1) topic + the Wikipedia articles to research it from
    plan = ask(cfg, "You plan episodes for an animated history channel about how ancient/early humans lived (curious "
                        "everyday-life questions). Pick ONE new topic that is NOT 'what did they do when they couldn't sleep' and is "
                        "not one of these titles on another channel (don't copy their wording either): " + "; ".join(DONE) +
                        '. Return JSON {"topic": "...", "articles": ["5-7 exact English Wikipedia article titles rich in concrete '
                        'archaeological finds, places, dates and numbers for this topic"]}', temperature=0.9)
    texts = {}
    for title in plan.get("articles", []):
        try:
            texts[title] = wiki.page(title)["text"][:14000]
        except Exception:
            print(f"[wiki  ] no article '{title}' - skipped")
    print(f"[plan  ] {plan.get('topic')}  - research: {list(texts)}")
    # 2) the episode, written only from those texts
    prompt = (FORMAT + "\nEXAMPLE (part of an approved episode; copy its pacing, concrete storytelling and shot style, not its "
              "topic):\n" + example() + "\n\nTOPIC: " + str(plan.get("topic")) + "\nRESEARCH - use ONLY facts from these Wikipedia "
              "texts and copy the fact phrases word for word from them:\n" + json.dumps(texts, ensure_ascii=False) +
              "\n\nWrite the whole episode now: 45-60 lines, real finds, places, dates and numbers from the research, a story with "
              "surprises, no generic filler lines. Return only the JSON.")
    ep = ask(cfg, prompt, temperature=0.8)
    if len(ep.get("lines", [])) < 40:
        print(f"[gemini] only {len(ep.get('lines', []))} lines - asking again for the full length")
        ep = ask(cfg, prompt + f"\n\nA first try was too short ({len(ep.get('lines', []))} lines). Write 45-60 lines.",
                          temperature=0.8)
    print(f"[gemini] {ep.get('title')}  ({len(ep.get('lines', []))} lines)")
    for rnd in range(2):
        bad = bad_facts(ep.get("facts", {}))
        if not bad:
            break
        print(f"[facts ] round {rnd + 1}: {sum(len(v['phrases']) for v in bad.values())} phrases not found - back to Gemini")
        pages = {}
        for title in bad:
            try:
                pages[title] = wiki.page(title)["text"][:12000]
            except Exception:
                pages[title] = "(no such article)"
        fix = (FORMAT + "\nThis episode JSON has fact phrases that are NOT in the Wikipedia articles (string match):\n" +
               json.dumps(bad, ensure_ascii=False) + "\n\nArticle texts:\n" + json.dumps(pages, ensure_ascii=False) +
               "\n\nFix it: copy phrases exactly from these texts, or change/cut the lines whose claims you can't support. "
               "Keep it 45-60 lines - replace cut lines with supported ones from the texts. "
               "Return the whole corrected episode JSON.\n\nEPISODE:\n" + json.dumps(ep, ensure_ascii=False))
        ep = ask(cfg, fix, temperature=0.4)
    bad = bad_facts(ep.get("facts", {}))
    illustrate(cfg, ep)
    tidy_layout(ep)
    slug = re.sub(r"[^a-z0-9_]", "", (ep.get("slug") or "gemini_ep").lower())[:40]
    out = ROOT / "episodes" / f"{slug}.json"
    out.write_text(json.dumps(ep, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"[saved ] {out}")
    if bad:
        raise SystemExit(f"[facts ] still unsupported after 2 fixes: {json.dumps(bad, ensure_ascii=False)[:800]}")
    print(f"[facts ] all {sum(len(v) for v in ep['facts'].values())} phrases found on Wikipedia")
    print(slug)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
