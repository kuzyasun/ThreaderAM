"""Build a sweep path recipe from the commit request."""

from __future__ import annotations


def build_sweep_path(thread_spec: dict) -> list[dict]:
    pitch = _as_positive_number(thread_spec.get("pitchMm"), 1.0)
    length = _as_positive_number(thread_spec.get("lengthMm"), pitch * 2)
    radius = _as_positive_number(thread_spec.get("majorDiameterMm"), 10.0) / 2.0
    handedness = thread_spec.get("handedness", "right")
    direction = -1 if handedness == "left" else 1
    turns = max(length / pitch, 1.0)
    sample_count = 24
    points = []

    for index in range(sample_count):
        ratio = index / max(sample_count - 1, 1)
        angle = ratio * turns * 6.283185307179586 * direction
        points.append(
            {
                "x": round(_cos(angle) * radius, 3),
                "y": round(_sin(angle) * radius, 3),
                "z": round(ratio * length, 3),
            }
        )

    return points


def _as_positive_number(value, fallback: float) -> float:
    if isinstance(value, (int, float)) and value > 0:
        return float(value)
    return fallback


def _sin(value: float) -> float:
    import math

    return math.sin(value)


def _cos(value: float) -> float:
    import math

    return math.cos(value)
