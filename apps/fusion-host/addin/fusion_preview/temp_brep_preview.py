"""Temporary BRep preview stub."""

from __future__ import annotations

from utils.logging_utils import log_info


class TemporaryBRepPreview:
    """Placeholder for richer temporary geometry preview."""

    def __init__(self):
        self._active = False

    def render(self, preview_request: dict) -> None:
        self._active = True
        log_info(
            "Temporary BRep preview placeholder updated for operation: "
            f"{preview_request.get('threadSpec', {}).get('operationMode')}"
        )

    def clear(self) -> None:
        self._active = False
        log_info("Temporary BRep preview cleared.")
