"""Dispatch palette messages to request handlers."""

from __future__ import annotations

from messaging.request_handlers import RequestHandlers
from utils.logging_utils import log_info


class MessageDispatcher:
    """Routes a deserialized message envelope to the correct handler."""

    def __init__(self, palette_manager=None):
        self._handlers = RequestHandlers(palette_manager=palette_manager)

    def dispatch(self, envelope: dict) -> dict:
        log_info(f"Dispatching action: {envelope.get('action')}")
        return self._handlers.handle(envelope)

    def clear_preview(self) -> None:
        self._handlers.clear_preview()

    def clear_commit_state(self) -> None:
        self._handlers.clear_commit_state()
