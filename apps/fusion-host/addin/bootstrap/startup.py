"""Startup lifecycle for the ThreadKit Fusion add-in."""

from __future__ import annotations

from commands.register_commands import register_commands
from palette.palette_manager import PaletteManager
from utils.logging_utils import log_info


_state = {
    "palette_manager": None,
    "command_context": None,
}


def startup(context) -> None:
    """Initialize command and palette infrastructure."""
    palette_manager = PaletteManager()
    command_context = register_commands(palette_manager=palette_manager)

    _state["palette_manager"] = palette_manager
    _state["command_context"] = command_context

    log_info("ThreadKit add-in startup complete.")


def get_runtime_state() -> dict:
    """Expose shared runtime objects for teardown."""
    return _state
