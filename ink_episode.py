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
DELIVERY = {"hush": ("-6%", "-4Hz"), "joke": ("+4%", "+3Hz"), "hook": ("+2%", "+0Hz"), "walk": ("+4%", "+0Hz"), "cold": ("-2%", "-3Hz"), "question": ("+2%", "+3Hz"),
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


HOST_STYLE = (
    "Grandpa Flint, an old, warm and funny grandfather telling a true story by the fire to children: a rich, slightly "
    "gravelly mature voice with clear articulation and a lively storyteller rhythm. Genuinely surprised and delighted on "
    "the reveals, a soft hushed voice on the scary or sad parts, a light chuckle on the jokes, playful when he talks to the "
    "listener, gentle and warm at the end. Expressive but natural, never shouty, no long pauses inside a line")
MOOD = {"hook": "happy", "walk": "happy", "cold": "worried", "question": "wow", "reveal": "wow", "stop": "wow",
        "payoff": "happy", "cta": "happy", "hush": "worried", "joke": "happy"}


def acted_voice(ep, job):
    """The episode in Grandpa Flint's acted voice (Gemini TTS, geo-shorts' acted.py): one take per part,
    so a whole episode costs only a handful of the free daily takes. Any failed part stops the build -
    an episode never mixes two voices."""
    import os
    if not os.environ.get("GEMINI_API_KEY"):
        from dotenv import dotenv_values
        os.environ["GEMINI_API_KEY"] = dotenv_values(ROOT.parent / "doodle-engine" / ".env").get("GEMINI_API_KEY", "")
    sys.path.insert(0, str(ROOT.parent / "geo-shorts"))
    import acted
    acted.VOICE = getattr(ep, "VOICE", "Gacrux")
    acted.STYLE["host"] = HOST_STYLE
    starts = [i for i, (_, _, sh) in enumerate(ep.LINES) if i == 0 or (sh and sh.get("chapter"))]
    parts = []
    for a, b in zip(starts, starts[1:] + [len(ep.LINES)]):
        for c in range(a, b, 14):                      # long parts in pieces of <= 14 lines
            parts.append((c, min(b, c + 14)))
    vo, wavs, t = [], [], 0.0
    for k, (a, b) in enumerate(parts):
        lines = [ep.LINES[i][0] for i in range(a, b)]
        pvo, mp3 = acted.perform(lines, "host", job / f"part{k:02d}")
        wav = job / f"part{k:02d}.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(mp3), "-ar", "48000", "-ac", "1", str(wav)], check=True)
        with wave.open(str(wav)) as w:
            d = w.getnframes() / w.getframerate()
        for v in pvo:
            vo.append({"text": v["text"], "start": round(v["start"] + t, 3), "end": round(v["end"] + t, 3)})
        wavs.append(wav)
        t += d + GAP
        print(f"  [part {k}] lines {a}-{b - 1}: {d:.1f}s")
    raw = job / "voice_raw.wav"
    frames = []
    for wv in wavs:
        with wave.open(str(wv)) as w:
            frames.append(w.readframes(w.getnframes()))
    with wave.open(str(raw), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000)
        w.writeframes((b"\x00\x00" * int(48000 * GAP)).join(frames))
    out = job / "voice.mp3"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", "loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", "48000",
                    "-b:a", "192k", str(out)], check=True)
    return vo, out


def mouth_track(voice_mp3, secs):
    """How open Flint's mouth is on each frame (0..1), from the loudness of the narration."""
    import numpy as np
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(voice_mp3), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                       capture_output=True, check=True)
    x = np.frombuffer(r.stdout, dtype=np.int16).astype(np.float32) / 32768
    hop = 16000 // 30
    n = int(secs * 30)
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) if i * hop < len(x) else 0.0 for i in range(n)])
    ref = np.percentile(rms[rms > 0], 95) if (rms > 0).any() else 1.0
    m = np.clip((rms / ref - 0.12) / 0.88, 0, 1)
    m = np.convolve(m, [0.25, 0.5, 0.25], mode="same")           # a little smoothing, no jitter
    return [round(float(v), 2) for v in m]


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
    elif getattr(ep, "ACTED", False):
        vo, voice_mp3 = acted_voice(ep, job)
    else:
        vo, voice_mp3 = voice(lines, job)
    secs = round(vo[-1]["end"] + 1.8, 2)
    shots, cur = [], None
    for i, (_, _, shot) in enumerate(ep.LINES):
        if shot is not None:
            cur = {**shot, "from": i}
            shots.append(cur)
    props = {"vo": vo, "shots": shots, "intro": getattr(ep, "INTRO", None), "durationInSeconds": secs,
             "shaders": bool(getattr(ep, "SHADERS", False)),
             "host": {"mouth": mouth_track(job / "voice.mp3", secs), "moods": [getattr(ep, "MOODS", {}).get(i, MOOD.get(k, "happy"))
                      for i, (_, k, _) in enumerate(ep.LINES)]} if getattr(ep, "HOST", False) else None}
    props_path.write_text(json.dumps(props), encoding="utf-8")
    print(f"[props ] {len(vo)} lines, {len(shots)} shots, {secs / 60:.1f} min")
    if "--props" in sys.argv:
        return
    silent = job / "silent.mp4"
    subprocess.run(["node", "render-ink.mjs", "InkEpisode", str(props_path), str(silent)], cwd=ROOT / "remotion", check=True)
    bed = job / "score.wav"
    score.build_score(bed, secs + 0.5, tone="calm", seed=96)
    out = job / f"{slug}.mp4"
    if "--no-sfx" not in sys.argv:
        # little sound effects (pops, whooshes) laid under the narration
        import sfx
        fx = sfx.build(vo, shots, secs, job / "sfx.wav")
        with_fx = job / "voice_fx.mp3"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(voice_mp3), "-i", str(fx), "-filter_complex",
                        "[1:a]volume=0.45[f];[0:a][f]amix=inputs=2:duration=first:normalize=0[a]", "-map", "[a]",
                        "-ar", "48000", "-b:a", "192k", str(with_fx)], check=True)
        voice_mp3 = with_fx
    mix.mix(silent, voice_mp3, bed, out, bed_db=-13)
    (job / "meta.json").write_text(json.dumps(ep.META, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[done  ] {out}  ({mix.duration(out) / 60:.1f} min)")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
