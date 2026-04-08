"""External thread build stub."""

from __future__ import annotations

from utils.logging_utils import log_info


def build_external_thread(build_plan: dict) -> dict:
    log_info("External thread build stub executed.")
    return {
        "featureName": "ThreadKitExternalThread",
        "booleanIntent": build_plan.get("booleanIntent", "join"),
        "pathPointCount": len(build_plan.get("pathPoints", [])),
        "profilePointCount": len(build_plan.get("profilePoints", [])),
    }
