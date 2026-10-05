"""Upload a rendered ink episode to Story_time10.

    python ink_upload.py sleep                         upload private (flip it in Studio)
    python ink_upload.py sleep --at 2026-10-06T13:15Z  scheduled: goes public at that time (UTC)

Uses output/ink_<slug>/{<slug>.mp4, meta.json, thumb.jpg}. Refuses to upload
unless the login is the Story_time10 channel. The custom thumbnail only sticks
once the channel is phone-verified (youtube.com/verify).
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from src import upload as yt  # noqa: E402
from src.cfg import load as load_cfg  # noqa: E402

CHANNEL = "Story_time10"


def main():
    slug = sys.argv[1]
    job = ROOT / "output" / f"ink_{slug}"
    meta = json.loads((job / "meta.json").read_text(encoding="utf-8"))
    at = None
    if "--at" in sys.argv:
        when = datetime.strptime(sys.argv[sys.argv.index("--at") + 1], "%Y-%m-%dT%H:%MZ").replace(tzinfo=timezone.utc)
        at = when.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    cfg = load_cfg()
    vid = yt.upload(cfg, str(job / f"{slug}.mp4"), meta["title"], meta["description"], meta["tags"],
                    privacy="private", thumb_path=str(job / "thumb.jpg"), publish_at=at, expect_channel=CHANNEL)
    print(f"[posted] https://youtu.be/{vid}" + (f"  goes public {at}" if at else "  (private)"))


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
