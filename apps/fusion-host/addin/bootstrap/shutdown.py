"""Shutdown lifecycle for the ThreadKit Fusion add-in."""

from __future__ import annotations

from bootstrap.startup import get_runtime_state
from commands.register_commands import unregister_commands
from utils.logging_utils import log_info


def shutdown(context) -> None:
    """Tear down palette and command resources."""
    runtime_state = get_runtime_state()
    palette_manager = runtime_state.get("palette_manager")
    command_context = runtime_state.get("command_context")

    if palette_manager is not None:
        palette_manager.dispose()

    unregister_commands(command_context)

    runtime_state["palette_manager"] = None
    runtime_state["command_context"] = None

    log_info("ThreadKit add-in shutdown complete.")
