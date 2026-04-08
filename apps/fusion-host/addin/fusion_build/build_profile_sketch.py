"""Build a profile sketch recipe from the commit request."""

from __future__ import annotations


def build_profile_sketch(thread_spec: dict) -> list[dict]:
    pitch = _as_positive_number(thread_spec.get("pitchMm"), 1.0)
    profile_shape = thread_spec.get("profileShape", "trapezoidal")
    crest_flat_percent = _as_number(thread_spec.get("crestFlatPercent"), 18.0)
    root_flat_percent = _as_number(thread_spec.get("rootFlatPercent"), 22.0)
    thread_depth = _thread_depth_mm(profile_shape, pitch)
    crest_width = round(pitch * (crest_flat_percent / 100.0), 3)
    root_width = round(pitch * (root_flat_percent / 100.0), 3)
    flank_run = max((pitch - crest_width - root_width) / 2.0, pitch * 0.05)

    return [
        {"x": round(-pitch / 2, 3), "y": 0.0},
        {"x": round(-root_width / 2.0 - flank_run, 3), "y": 0.0},
        {"x": round(-root_width / 2.0, 3), "y": round(-thread_depth, 3)},
        {"x": round(root_width / 2.0, 3), "y": round(-thread_depth, 3)},
        {"x": round(root_width / 2.0 + flank_run, 3), "y": 0.0},
        {"x": round(pitch / 2, 3), "y": 0.0},
    ]


def _thread_depth_mm(profile_shape: str, pitch: float) -> float:
    if profile_shape == "triangular":
        return pitch * 0.613
    if profile_shape == "squareLike":
        return pitch * 0.44
    return pitch * 0.52


def _as_positive_number(value, fallback: float) -> float:
    if isinstance(value, (int, float)) and value > 0:
        return float(value)
    return fallback


def _as_number(value, fallback: float) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    return fallback
