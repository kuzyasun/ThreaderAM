"""JSON bridge between the palette UI and the host runtime."""

from __future__ import annotations

import json

from messaging.message_dispatcher import MessageDispatcher
from utils.logging_utils import log_error, log_info


class PaletteBridge:
    """Accepts inbound messages and emits outbound JSON payloads."""

    def __init__(self, palette_manager):
        self._palette_manager = palette_manager
        self._dispatcher = MessageDispatcher(palette_manager=palette_manager)

    def on_message(self, raw_message: str) -> str:
        try:
            envelope = json.loads(raw_message)
            response = self._dispatcher.dispatch(envelope)
            encoded = json.dumps(response)
            log_info(f"Bridge response prepared for action: {response.get('action')}")
            return encoded
        except Exception as exc:  # pragma: no cover - defensive host fallback
            log_error(f"Palette bridge failed: {exc}")
            return json.dumps(
                {
                    "requestId": "bridge-error",
                    "action": "ui.hostError",
                    "source": "fusion-host",
                    "payload": {
                        "code": "host.bridge.failure",
                        "message": str(exc),
                    },
                }
            )

    def clear_preview(self) -> None:
        self._dispatcher.clear_preview()

    def clear_commit_state(self) -> None:
        self._dispatcher.clear_commit_state()
