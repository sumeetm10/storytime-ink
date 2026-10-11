"""Little sound effects for an ink episode, timed from the same shot data the animation uses:
a soft whoosh on every cut, a pop when a tag / prop / person appears, a swoop for birds.
All synthesized here (numpy), nothing downloaded.
"""
import wave

import numpy as np

SR = 48000


def _pop(rng):
    n = int(0.11 * SR); t = np.arange(n) / SR
    f = 520 + rng.uniform(-60, 60)
    return np.sin(2 * np.pi * f * t * (1 + 2.5 * t)) * np.exp(-t * 38) * 0.55


def _whoosh(rng, dur=0.45):
    n = int(dur * SR); t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    k = np.exp(-((t - dur * 0.45) ** 2) / (2 * (dur * 0.18) ** 2))
    smooth = np.convolve(noise, np.ones(18) / 18, mode="same")          # soft, airy
    return smooth * k * 0.35


def _swoop(rng):
    n = int(0.9 * SR); t = np.arange(n) / SR
    f = 900 - 600 * t
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15 + _whoosh(rng, 0.9) * 0.8) * np.exp(-((t - 0.5) ** 2) / 0.08)


def events(vo, shots, total):
    """(time, kind) for every cut and every element that pops in."""
    start = [v["start"] for v in vo]
    nxt = lambda i: start[i + 1] if i + 1 < len(vo) else total
    out = []
    for si, sh in enumerate(shots):
        S = start[sh["from"]]
        E = start[shots[si + 1]["from"]] if si + 1 < len(shots) else total
        if si:
            out.append((S - 0.12, "whoosh"))
        for el in sh.get("tags", []) + sh.get("props", []) + sh.get("actors", []) + ([sh["big"]] if sh.get("big") else []):
            li = sh["from"] + el.get("line", 0)
            kind = "swoop" if el.get("k") == "eagle" else "pop"
            if el.get("word"):
                txt = vo[li]["text"].lower(); k = txt.find(el["word"].lower())
                if k >= 0:
                    fr = max(0.0, k / max(1, len(txt)) - 0.03)
                    out.append((start[li] + fr * (nxt(li) - start[li]), kind))
            elif el.get("at") and el["at"] > 0:
                if "line" in el:
                    out.append((start[li] + el["at"] * (nxt(li) - start[li]), kind))
                else:
                    out.append((S + el["at"] * (E - S), kind))
            elif kind == "swoop":
                out.append((S + 0.1, kind))
    return sorted(out)


def build(vo, shots, total, path, seed=7):
    rng = np.random.default_rng(seed)
    track = np.zeros(int((total + 1) * SR))
    last = -1.0
    for t, kind in events(vo, shots, total):
        if t - last < 0.18 and kind == "pop":          # never a machine-gun of pops
            continue
        s = {"pop": _pop, "whoosh": _whoosh, "swoop": _swoop}[kind](rng)
        a = int(max(0, t) * SR)
        track[a:a + len(s)] += s[: len(track) - a]
        last = t
    track = np.clip(track, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((track * 32767 * 0.9).astype(np.int16).tobytes())
    return path
