"""Internal thread build stub."""

from __future__ import annotations

from utils.logging_utils import log_info


def build_internal_thread(build_plan: dict) -> dict:
    log_info("Internal thread build stub executed.")
    return {
        "featureName": "ThreadKitInternalThread",
        "booleanIntent": build_plan.get("booleanIntent", "cut"),
        "pathPointCount": len(build_plan.get("pathPoints", [])),
        "profilePointCount": len(build_plan.get("profilePoints", [])),
    }
