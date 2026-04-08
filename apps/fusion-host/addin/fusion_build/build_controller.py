"""Host-side commit controller for structured thread build requests."""

from __future__ import annotations

from fusion_build.build_boolean_ops import build_boolean_intent
from fusion_build.build_external_thread import build_external_thread
from fusion_build.build_internal_thread import build_internal_thread
from fusion_build.build_profile_sketch import build_profile_sketch
from fusion_build.build_sweep_path import build_sweep_path


class BuildController:
    """Build a serializable plan and execute a host-side build stub."""

    def __init__(self):
        self._last_commit_result = None

    def commit_thread(self, commit_request: dict) -> dict:
        thread_spec = dict(commit_request.get("threadSpec") or {})
        selection_context = dict(commit_request.get("selectionContext") or {})
        print_settings = dict(commit_request.get("printSettings") or {})

        build_plan = {
            "normalizedSpec": _normalize_spec(thread_spec),
            "booleanIntent": build_boolean_intent(thread_spec),
            "pathPoints": build_sweep_path(thread_spec),
            "profilePoints": build_profile_sketch(thread_spec),
            "issues": _build_commit_issues(thread_spec, selection_context),
            "recommendations": _build_commit_recommendations(thread_spec, print_settings),
        }

        success = len([issue for issue in build_plan["issues"] if issue.get("severity") == "error"]) == 0
        if success:
            if thread_spec.get("operationMode") == "internal":
                build_summary = build_internal_thread(build_plan)
            else:
                build_summary = build_external_thread(build_plan)
        else:
            build_summary = {
                "featureName": None,
                "booleanIntent": build_plan["booleanIntent"],
                "pathPointCount": len(build_plan["pathPoints"]),
                "profilePointCount": len(build_plan["profilePoints"]),
            }

        commit_result = {
            "success": success,
            "buildPlan": build_plan,
            "buildSummary": build_summary,
            "message": _build_commit_message(success, build_plan),
        }

        self._last_commit_result = commit_result
        return commit_result

    def clear(self) -> None:
        self._last_commit_result = None

    def last_commit_result(self) -> dict | None:
        return self._last_commit_result


def _normalize_spec(thread_spec: dict) -> dict:
    normalized = dict(thread_spec)
    normalized.setdefault("starts", 1)
    normalized.setdefault("handedness", "right")
    normalized.setdefault("profileShape", "trapezoidal")
    normalized.setdefault("operationMode", "external")
    normalized.setdefault("clearanceMode", "preset")
    return normalized


def _build_commit_issues(thread_spec: dict, selection_context: dict) -> list[dict]:
    issues = []

    available_length = selection_context.get("availableLengthMm")
    requested_length = thread_spec.get("lengthMm")
    if isinstance(available_length, (int, float)) and isinstance(requested_length, (int, float)):
        if requested_length > available_length:
            issues.append(
                {
                    "code": "selection.length.exceeded",
                    "severity": "error",
                    "field": "lengthMm",
                    "message": "Requested thread length exceeds the available host selection length.",
                }
            )

    operation_mode = thread_spec.get("operationMode")
    if operation_mode == "internal" and selection_context.get("isInternalCandidate") is False:
        issues.append(
            {
                "code": "selection.mode.mismatch",
                "severity": "warning",
                "field": "operationMode",
                "message": "Current selection looks external, so the internal build may fail in Fusion.",
            }
        )
    if operation_mode == "external" and selection_context.get("isExternalCandidate") is False:
        issues.append(
            {
                "code": "selection.mode.mismatch",
                "severity": "warning",
                "field": "operationMode",
                "message": "Current selection looks internal, so the external build may fail in Fusion.",
            }
        )

    return issues


def _build_commit_recommendations(thread_spec: dict, print_settings: dict) -> list[dict]:
    recommendations = []

    if print_settings.get("materialFamily") == "PETG":
        recommendations.append(
            {
                "code": "material.petg.commit",
                "title": "Expect a looser mating fit",
                "details": "PETG thread builds are usually safer with slightly more clearance at commit time.",
                "priority": "medium",
            }
        )

    if isinstance(thread_spec.get("lengthMm"), (int, float)) and thread_spec.get("lengthMm") > 18:
        recommendations.append(
            {
                "code": "build.lead-in",
                "title": "Add a lead-in after the first working build",
                "details": "Longer thread commits benefit from a short chamfer or run-in feature once geometry is stable.",
                "priority": "medium",
            }
        )

    return recommendations


def _build_commit_message(success: bool, build_plan: dict) -> str:
    if success:
        return (
            "Thread commit stub completed. Fusion feature creation is still a placeholder, "
            "but the host now produces a structured build plan and commit result."
        )

    return (
        "Thread commit was blocked by validation issues. Resolve error-level issues before "
        "running the actual Fusion build step."
    )
