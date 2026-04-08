"""Request handlers for the initial palette bridge actions."""

from __future__ import annotations

from fusion_build.build_controller import BuildController
from fusion_preview.preview_controller import PreviewController
from fusion_selection.selection_reader import SelectionReader
from fusion_state.recent_configs import RecentConfigStore
from messaging.response_builders import make_envelope, make_error_envelope


class RequestHandlers:
    """Handle UI-to-host actions for the MVP bridge skeleton."""

    def __init__(self, palette_manager=None):
        self._palette_manager = palette_manager
        self._selection_reader = SelectionReader()
        self._preview_controller = PreviewController()
        self._build_controller = BuildController()
        self._recent_config_store = RecentConfigStore()

    def handle(self, envelope: dict) -> dict:
        action = envelope.get("action")
        request_id = envelope.get("requestId", "missing-request-id")

        if action == "host.ping":
            return self.handle_ping(request_id=request_id)

        if action == "host.getSelectionContext":
            return self.handle_get_selection_context(request_id=request_id)

        if action == "host.previewThread":
            return self.handle_preview_thread(
                request_id=request_id,
                payload=envelope.get("payload") or {},
            )

        if action == "host.commitThread":
            return self.handle_commit_thread(
                request_id=request_id,
                payload=envelope.get("payload") or {},
            )

        if action == "host.loadRecentConfig":
            return self.handle_load_recent_config(request_id=request_id)

        if action == "host.saveRecentConfig":
            return self.handle_save_recent_config(
                request_id=request_id,
                payload=envelope.get("payload") or {},
            )

        return make_error_envelope(
            request_id=request_id,
            code="host.action.unsupported",
            message=f"Unsupported host action: {action}",
        )

    def handle_ping(self, request_id: str) -> dict:
        payload = {
            "host": "fusion-host",
            "status": "ready",
            "paletteVisible": bool(self._palette_manager and self._palette_manager.is_palette_visible()),
        }
        return make_envelope("ui.hostReady", payload=payload, request_id=request_id)

    def handle_get_selection_context(self, request_id: str) -> dict:
        return make_envelope(
            "ui.selectionContextChanged",
            payload=self._selection_reader.read_current_context(),
            request_id=request_id,
        )

    def handle_preview_thread(self, request_id: str, payload: dict) -> dict:
        preview_payload = dict(payload)
        preview_payload.setdefault("selectionContext", self._selection_reader.read_current_context())

        if not preview_payload.get("threadSpec") or not preview_payload.get("printSettings"):
            return make_error_envelope(
                request_id=request_id,
                code="host.preview.invalidPayload",
                message="Preview request requires threadSpec and printSettings payload sections.",
            )

        preview_result = self._preview_controller.update_preview(preview_payload)
        return make_envelope("ui.previewResult", payload=preview_result, request_id=request_id)

    def handle_commit_thread(self, request_id: str, payload: dict) -> dict:
        commit_payload = dict(payload)
        commit_payload.setdefault("selectionContext", self._selection_reader.read_current_context())

        if not commit_payload.get("threadSpec") or not commit_payload.get("printSettings"):
            return make_error_envelope(
                request_id=request_id,
                code="host.commit.invalidPayload",
                message="Commit request requires threadSpec and printSettings payload sections.",
            )

        commit_result = self._build_controller.commit_thread(commit_payload)
        return make_envelope("ui.commitResult", payload=commit_result, request_id=request_id)

    def handle_load_recent_config(self, request_id: str) -> dict:
        stored = self._recent_config_store.load()
        payload = {
            "hasConfig": stored is not None,
            "savedAt": stored.get("savedAt") if stored else None,
            "config": stored.get("config") if stored else None,
        }
        return make_envelope("ui.recentConfigLoaded", payload=payload, request_id=request_id)

    def handle_save_recent_config(self, request_id: str, payload: dict) -> dict:
        if not payload.get("threadSpec") or not payload.get("printSettings"):
            return make_error_envelope(
                request_id=request_id,
                code="host.recentConfig.invalidPayload",
                message="Recent config payload requires threadSpec and printSettings.",
            )

        stored = self._recent_config_store.save(payload)
        return make_envelope(
            "ui.recentConfigSaved",
            payload={
                "hasConfig": True,
                "savedAt": stored.get("savedAt"),
            },
            request_id=request_id,
        )

    def clear_preview(self) -> None:
        self._preview_controller.clear_preview()

    def clear_commit_state(self) -> None:
        self._build_controller.clear()
