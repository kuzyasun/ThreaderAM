"""Custom graphics preview stub.

This is a safe placeholder that records intent until real Fusion rendering is wired.
"""

from __future__ import annotations

from utils.logging_utils import log_info


class CustomGraphicsPreview:
    """Placeholder renderer for lightweight preview overlays."""

    def __init__(self):
        self._last_render_summary = None

    def render(self, preview_request: dict) -> None:
        self._last_render_summary = {
            "mode": preview_request.get("previewMode"),
            "majorDiameterMm": preview_request.get("threadSpec", {}).get("majorDiameterMm"),
        }
        log_info(f"Custom graphics preview updated for mode: {preview_request.get('previewMode')}")

    def clear(self) -> None:
        self._last_render_summary = None
        log_info("Custom graphics preview cleared.")
