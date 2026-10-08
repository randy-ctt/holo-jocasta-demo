#!/usr/bin/env bash
# Holocron AI-tool hook shim (Claude Code / Cursor). Wave 2 wires the live POST.
# Observes only, never blocks the caller.
command -v holo >/dev/null 2>&1 && (holo hook "${1:-unknown}" >/dev/null 2>&1 &)
exit 0
