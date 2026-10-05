"""Load .env + config.yaml. Single source of truth for paths and settings."""
import os
from pathlib import Path

import yaml
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent


def load():
    load_dotenv(ROOT / ".env")
    with open(ROOT / "config.yaml", "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    cfg["_root"] = ROOT
    cfg["gemini_api_key"] = os.environ.get("GEMINI_API_KEY", "")
    return cfg


def channel_dna():
    return (ROOT / "prompts" / "channel_dna.md").read_text(encoding="utf-8")
