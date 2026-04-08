"""Fusion add-in entry point for the ThreadKit MVP scaffold."""

from __future__ import annotations

from bootstrap.startup import startup
from bootstrap.shutdown import shutdown


def run(context):
    """Called by Fusion when the add-in starts."""
    startup(context)


def stop(context):
    """Called by Fusion when the add-in stops."""
    shutdown(context)
