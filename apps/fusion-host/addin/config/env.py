"""Environment-driven config values."""

from __future__ import annotations

import os
from pathlib import Path


ADDIN_ROOT = Path(__file__).resolve().parents[1]


def get_env(name: str, default: str | None = None) -> str | None:
    return os.getenv(name, default)
