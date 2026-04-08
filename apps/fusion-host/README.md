# Fusion Host

This package contains the Autodesk Fusion add-in scaffold for ThreadKit.

For P1 it only provides:

- add-in manifest placeholder
- lifecycle entry points in `ThreadKit.py`
- folder layout for commands, palette integration, and static resources

Current bridge scaffold includes:

- command registration shell
- palette manager with dev/prod URL resolution
- JSON message dispatcher
- initial handlers for `host.ping` and `host.getSelectionContext`
- preview pipeline stub for `host.previewThread`
- commit pipeline stub for `host.commitThread`

Set `THREADKIT_PALETTE_URL` to point Fusion at a running UI dev server during local development.
