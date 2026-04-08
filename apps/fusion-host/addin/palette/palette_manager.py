"""Palette lifecycle management for dev and packaged modes."""

from __future__ import annotations

from config.palette_url import get_palette_url
from palette.palette_bridge import PaletteBridge
from utils.logging_utils import log_info, log_warning


class PaletteManager:
    """Owns the palette URL and bridge wiring for the add-in."""

    def __init__(self):
        self._palette_url = get_palette_url()
        self._bridge = PaletteBridge(self)
        self._is_visible = False

    @property
    def palette_url(self) -> str:
        return self._palette_url

    def show_palette(self) -> None:
        self._is_visible = True
        log_info(f"Palette requested: {self._palette_url}")

    def hide_palette(self) -> None:
        self._is_visible = False
        log_info("Palette hidden.")

    def is_palette_visible(self) -> bool:
        return self._is_visible

    def handle_message(self, raw_message: str) -> str:
        return self._bridge.on_message(raw_message)

    def send_host_ready(self) -> str:
        return self.handle_message(
            '{"requestId":"startup-host-ready","action":"host.ping","source":"ui","payload":{}}'
        )

    def clear_preview(self) -> None:
        self._bridge.clear_preview()

    def clear_commit_state(self) -> None:
        self._bridge.clear_commit_state()

    def dispose(self) -> None:
        self.clear_preview()
        self.clear_commit_state()
        if self._is_visible:
            self.hide_palette()
        else:
            log_warning("Palette dispose called while palette was already hidden.")
