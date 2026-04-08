"""Response envelope builders for palette communication."""

from __future__ import annotations


def make_envelope(action: str, payload: dict, request_id: str, source: str = "fusion-host") -> dict:
    return {
        "requestId": request_id,
        "action": action,
        "source": source,
        "payload": payload,
    }


def make_error_envelope(request_id: str, code: str, message: str) -> dict:
    return make_envelope(
        action="ui.hostError",
        request_id=request_id,
        payload={
            "code": code,
            "message": message,
        },
    )
