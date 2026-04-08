"""Minimal command lifecycle for the ThreadKit add-in."""

from __future__ import annotations

from utils.logging_utils import log_info


class ThreadCommand:
    """Owns the primary ThreadKit command wiring."""

    def __init__(self, palette_manager):
        self._palette_manager = palette_manager
        self._is_registered = False

    def register(self) -> None:
        self._is_registered = True
        log_info("ThreadKit command registered.")

    def execute(self) -> None:
        if not self._is_registered:
            log_info("ThreadKit command execute requested before registration.")
            return

        self._palette_manager.show_palette()
        self._palette_manager.send_host_ready()
        log_info("ThreadKit command executed.")

    def unregister(self) -> None:
        self._is_registered = False
