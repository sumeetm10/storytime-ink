# Story_time10 ink episodes

Animated history episodes about how ancient humans lived, drawn entirely in code (Remotion) in a
hand-drawn ink style, narrated with a free voice, and posted to YouTube.

- `episodes/` - one file per episode: script, Wikipedia-checked facts, and a shot list
  (`sleep.py` was written by hand; `*.json` by Gemini via `gemini_episode.py`).
- `ink_episode.py` - voice + render + music + mix. `ink_upload.py` - scheduled upload.
- `storytime_auto.py` - the 2-day cycle run by `.github/workflows/storytime.yml`.
- `remotion/src/ink/` - the cast, props and renderer.

Font: Patrick Hand (SIL Open Font License). Music is synthesized. No secrets are stored here.
