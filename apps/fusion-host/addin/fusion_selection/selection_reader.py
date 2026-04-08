"""Read a minimal host selection context with safe fallbacks."""

from __future__ import annotations

from utils.logging_utils import log_warning


class SelectionReader:
    """Returns a selection context that matches the shared domain contract."""

    def read_current_context(self) -> dict:
        try:
            # Fusion selection inspection will be implemented in a later pass.
            return self._mock_selection_context()
        except Exception as exc:  # pragma: no cover - defensive host fallback
            log_warning(f"Failed to inspect Fusion selection; using fallback context. {exc}")
            return self._mock_selection_context()

    def _mock_selection_context(self) -> dict:
        return {
            "selectionType": "cylindricalFace",
            "cylinderDiameterMm": 40.0,
            "availableLengthMm": 32.0,
            "isInternalCandidate": False,
            "isExternalCandidate": True,
            "axisDirection": {"x": 0.0, "y": 0.0, "z": 1.0},
            "axisOrigin": {"x": 0.0, "y": 0.0, "z": 0.0},
        }
