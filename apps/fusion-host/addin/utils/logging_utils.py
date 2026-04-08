"""Logging helpers that stay usable outside Fusion."""

from __future__ import annotations


def log_info(message: str) -> None:
    print(f"[ThreadKit] {message}")


def log_warning(message: str) -> None:
    print(f"[ThreadKit][warning] {message}")


def log_error(message: str) -> None:
    print(f"[ThreadKit][error] {message}")
