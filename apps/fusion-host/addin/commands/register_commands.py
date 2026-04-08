"""Register and unregister ThreadKit Fusion commands."""

from __future__ import annotations

from commands.thread_command import ThreadCommand
from utils.logging_utils import log_info


def register_commands(palette_manager):
    command = ThreadCommand(palette_manager=palette_manager)
    command.register()
    log_info("ThreadKit command registration finished.")
    return {"thread_command": command}


def unregister_commands(command_context) -> None:
    if not command_context:
        return

    thread_command = command_context.get("thread_command")
    if thread_command is not None:
        thread_command.unregister()
        log_info("ThreadKit command unregistered.")
