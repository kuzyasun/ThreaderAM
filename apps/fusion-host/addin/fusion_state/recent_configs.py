"""Persist recently used ThreadKit configs outside the repository tree."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from utils.logging_utils import log_warning


class RecentConfigStore:
    """Stores the latest thread configuration snapshot for the current user."""

    def __init__(self):
        self._storage_path = Path.home() / ".threadkit" / "recent-config.json"

    def load(self) -> dict | None:
        if not self._storage_path.exists():
            return None

        try:
            with self._storage_path.open("r", encoding="utf-8") as handle:
                payload = json.load(handle)
            return payload if isinstance(payload, dict) else None
        except Exception as exc:  # pragma: no cover - defensive host fallback
            log_warning(f"Failed to load recent config from disk. {exc}")
            return None

    def save(self, config: dict) -> dict:
        payload = {
            "savedAt": datetime.now(timezone.utc).isoformat(),
            "config": config,
        }
        self._storage_path.parent.mkdir(parents=True, exist_ok=True)
        with self._storage_path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2)
        return payload
