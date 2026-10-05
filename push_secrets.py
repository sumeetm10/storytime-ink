"""Run this yourself once (it uses your gh login): copies the Story_time10 YouTube login and the
Gemini key from Desktop/doodle-engine into this repo's GitHub secrets. Nothing is printed or committed.

    python push_secrets.py
"""
import base64
import subprocess
from pathlib import Path

from dotenv import dotenv_values

SRC = Path(__file__).resolve().parent.parent / "doodle-engine"
REPO = "sumeetm10/storytime-ink"


def put(name, value):
    subprocess.run(["gh", "secret", "set", name, "--repo", REPO], input=value.encode(), check=True)
    print(f"set {name}")


put("YT_TOKEN_B64", base64.b64encode((SRC / "token.json").read_bytes()).decode())
put("YT_CLIENT_SECRET", (SRC / "client_secret.json").read_text(encoding="utf-8"))
put("GEMINI_API_KEY", dotenv_values(SRC / ".env")["GEMINI_API_KEY"])
