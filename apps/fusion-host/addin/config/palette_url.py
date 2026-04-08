"""Resolve the palette URL for development and packaged modes."""

from __future__ import annotations

from config.env import ADDIN_ROOT, get_env
from utils.logging_utils import log_warning


def get_palette_url() -> str:
    dev_url = get_env("THREADKIT_PALETTE_URL")
    if dev_url:
        return dev_url

    prod_entry = ADDIN_ROOT / "resources" / "web-dist" / "index.html"
    if not prod_entry.exists():
        log_warning(
            "Palette build output is missing. Falling back to about:blank until ui-web is copied into web-dist."
        )
        return "about:blank"

    return prod_entry.as_uri()
