"""Build boolean operation metadata for the commit recipe."""

from __future__ import annotations


def build_boolean_intent(thread_spec: dict) -> str:
    if thread_spec.get("operationMode") == "internal":
        return "cut"
    return "join"
