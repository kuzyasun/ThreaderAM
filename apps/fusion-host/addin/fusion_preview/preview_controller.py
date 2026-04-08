"""Host-side preview controller for the bridge pipeline."""

from __future__ import annotations

from fusion_preview.custom_graphics_preview import CustomGraphicsPreview
from fusion_preview.temp_brep_preview import TemporaryBRepPreview


class PreviewController:
    """Coordinates preview rendering and returns a preview-result payload."""

    def __init__(self):
        self._graphics_preview = CustomGraphicsPreview()
        self._temp_brep_preview = TemporaryBRepPreview()
        self._last_preview_result = None

    def update_preview(self, preview_request: dict) -> dict:
        """Render preview placeholders and produce a serializable result."""
        self._graphics_preview.render(preview_request)
        self._temp_brep_preview.render(preview_request)

        preview_result = _build_preview_result(preview_request)
        self._last_preview_result = preview_result
        return preview_result

    def clear_preview(self) -> None:
        self._graphics_preview.clear()
        self._temp_brep_preview.clear()
        self._last_preview_result = None

    def last_preview_result(self) -> dict | None:
        return self._last_preview_result


def _build_preview_result(preview_request: dict) -> dict:
    thread_spec = preview_request.get("threadSpec", {})
    print_settings = preview_request.get("printSettings", {})
    selection_context = preview_request.get("selectionContext") or {}

    pitch = _as_positive_number(thread_spec.get("pitchMm"), 1.0)
    major_diameter = _as_positive_number(thread_spec.get("majorDiameterMm"), 10.0)
    length = _as_positive_number(thread_spec.get("lengthMm"), pitch * 2)
    crest_flat_percent = _as_number(thread_spec.get("crestFlatPercent"), 18.0)
    root_flat_percent = _as_number(thread_spec.get("rootFlatPercent"), 22.0)
    layer_height = _as_positive_number(print_settings.get("layerHeightMm"), 0.2)
    nozzle_diameter = _as_positive_number(print_settings.get("nozzleDiameterMm"), 0.4)
    profile_shape = thread_spec.get("profileShape", "trapezoidal")
    handedness = thread_spec.get("handedness", "right")

    thread_depth = _thread_depth_mm(profile_shape, pitch)
    crest_width = round(pitch * (crest_flat_percent / 100.0), 3)
    root_width = round(pitch * (root_flat_percent / 100.0), 3)
    issues = _build_issues(thread_spec, print_settings, selection_context, pitch)
    recommendations = _build_recommendations(thread_spec, print_settings, selection_context)

    return {
        "profile2d": {
            "profilePoints": [
                {"x": round(-pitch / 2, 3), "y": 0.0},
                {"x": round(-root_width / 2 - (pitch - crest_width - root_width) / 2, 3), "y": 0.0},
                {"x": round(-root_width / 2, 3), "y": round(-thread_depth, 3)},
                {"x": round(root_width / 2, 3), "y": round(-thread_depth, 3)},
                {"x": round(root_width / 2 + (pitch - crest_width - root_width) / 2, 3), "y": 0.0},
                {"x": round(pitch / 2, 3), "y": 0.0},
            ],
            "dimensionsMm": {
                "threadDepth": round(thread_depth, 3),
                "crestWidth": crest_width,
                "rootWidth": root_width,
            },
        },
        "helix3d": {
            "pathPoints": _sample_helix_points(
                radius_mm=major_diameter / 2.0,
                pitch_mm=pitch,
                length_mm=length,
                handedness=handedness,
            ),
            "turnCount": round(length / pitch, 2),
        },
        "layerSlices": _build_layer_slices(pitch, thread_depth, layer_height, nozzle_diameter),
        "issues": issues,
        "recommendations": recommendations,
        "score": _build_score(issues, profile_shape, layer_height),
    }


def _build_issues(
    thread_spec: dict, print_settings: dict, selection_context: dict, pitch: float
) -> list[dict]:
    issues = []

    available_length = selection_context.get("availableLengthMm")
    requested_length = thread_spec.get("lengthMm")
    if _is_number(available_length) and _is_number(requested_length) and requested_length > available_length:
        issues.append(
            {
                "code": "selection.length.exceeded",
                "severity": "error",
                "field": "lengthMm",
                "message": "Requested thread length exceeds the available host selection length.",
            }
        )

    nozzle_diameter = _as_positive_number(print_settings.get("nozzleDiameterMm"), 0.4)
    if pitch < nozzle_diameter * 1.15:
        issues.append(
            {
                "code": "print.pitch.tight",
                "severity": "warning",
                "field": "pitchMm",
                "message": "Pitch is tight relative to the active nozzle and may soften flank detail.",
            }
        )

    layer_height = _as_positive_number(print_settings.get("layerHeightMm"), 0.2)
    if layer_height > pitch * 0.38:
        issues.append(
            {
                "code": "print.layer.coarse",
                "severity": "warning",
                "field": "layerHeightMm",
                "message": "Layer height is coarse for this pitch and will accent stair-stepping across the flanks.",
            }
        )

    operation_mode = thread_spec.get("operationMode")
    if operation_mode == "internal" and selection_context.get("isInternalCandidate") is False:
        issues.append(
            {
                "code": "selection.mode.mismatch",
                "severity": "warning",
                "field": "operationMode",
                "message": "The current selection looks more like an external target than an internal one.",
            }
        )

    return issues


def _build_recommendations(
    thread_spec: dict, print_settings: dict, selection_context: dict
) -> list[dict]:
    recommendations = []

    if thread_spec.get("profileShape") == "triangular":
        recommendations.append(
            {
                "code": "profile.swap.trapezoid",
                "title": "Consider trapezoidal flanks",
                "details": "A trapezoidal profile typically preserves crest support better on utility FDM threads.",
                "priority": "medium",
            }
        )

    if print_settings.get("materialFamily") == "PETG":
        recommendations.append(
            {
                "code": "material.petg.clearance",
                "title": "Bias clearance upward for PETG",
                "details": "PETG often runs tackier on mating surfaces, so slightly looser fits tend to behave better.",
                "priority": "high",
            }
        )

    if _as_number(selection_context.get("cylinderDiameterMm"), 0.0) >= 30:
        recommendations.append(
            {
                "code": "preview.large-diameter",
                "title": "Inspect the first turn before commit",
                "details": "Large diameters magnify profile proportion issues, so the first-turn preview is especially useful.",
                "priority": "low",
            }
        )

    if _as_number(thread_spec.get("lengthMm"), 0.0) > 18:
        recommendations.append(
            {
                "code": "build.lead-in",
                "title": "Plan a lead-in during commit",
                "details": "Longer threads usually feel better if the final build includes a small entry chamfer.",
                "priority": "medium",
            }
        )

    return recommendations


def _thread_depth_mm(profile_shape: str, pitch: float) -> float:
    if profile_shape == "triangular":
        return pitch * 0.613
    if profile_shape == "squareLike":
        return pitch * 0.44
    return pitch * 0.52


def _sample_helix_points(
    radius_mm: float, pitch_mm: float, length_mm: float, handedness: str
) -> list[dict]:
    turns = max(length_mm / pitch_mm, 1.0)
    sample_count = 28
    direction = -1 if handedness == "left" else 1
    points = []

    for index in range(sample_count):
        ratio = index / max(sample_count - 1, 1)
        angle = ratio * turns * 6.283185307179586 * direction
        points.append(
            {
                "x": round(_cos(angle) * radius_mm, 3),
                "y": round(_sin(angle) * radius_mm, 3),
                "z": round(ratio * length_mm, 3),
            }
        )

    return points


def _build_layer_slices(
    pitch: float, thread_depth: float, layer_height: float, nozzle_diameter: float
) -> list[dict]:
    slices = []
    slice_count = 4

    for index in range(slice_count):
        ratio = index / max(slice_count - 1, 1)
        width = max(pitch * (1 - ratio * 0.45), nozzle_diameter)
        shoulder = width * 0.18
        depth_y = thread_depth * (0.6 + ratio * 0.2)
        slices.append(
            {
                "index": index,
                "zMm": round(index * layer_height, 3),
                "segments": [
                    {
                        "start": {"x": round(-width / 2, 3), "y": round(ratio * thread_depth * 0.25, 3)},
                        "end": {"x": round(-shoulder, 3), "y": round(depth_y, 3)},
                    },
                    {
                        "start": {"x": round(-shoulder, 3), "y": round(depth_y, 3)},
                        "end": {"x": round(shoulder, 3), "y": round(depth_y, 3)},
                    },
                    {
                        "start": {"x": round(shoulder, 3), "y": round(depth_y, 3)},
                        "end": {"x": round(width / 2, 3), "y": round(ratio * thread_depth * 0.25, 3)},
                    },
                ],
            }
        )

    return slices


def _build_score(issues: list[dict], profile_shape: str, layer_height: float) -> int:
    score = 92
    score -= len([issue for issue in issues if issue.get("severity") == "error"]) * 24
    score -= len([issue for issue in issues if issue.get("severity") == "warning"]) * 10

    if profile_shape == "squareLike":
        score -= 6
    if layer_height > 0.28:
        score -= 8

    return max(min(score, 98), 20)


def _as_positive_number(value, fallback: float) -> float:
    if _is_number(value) and value > 0:
        return float(value)
    return fallback


def _as_number(value, fallback: float) -> float:
    if _is_number(value):
        return float(value)
    return fallback


def _is_number(value) -> bool:
    return isinstance(value, (int, float))


def _sin(value: float) -> float:
    import math

    return math.sin(value)


def _cos(value: float) -> float:
    import math

    return math.cos(value)
