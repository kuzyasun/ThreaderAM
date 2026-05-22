# ThreadKit Remaining Work From Mock Baseline

This document captures what still needs to be completed starting from the mock-driven local UI version of ThreadKit.

It is written intentionally from the perspective of the stable mock baseline, because later bridge and host-connected work has been stashed for now and may be restored later. That means this file should remain useful even if the stashed changes are not currently applied in the workspace.

## Current Baseline

The current mock baseline already gives us a strong local MVP for thread setup and preview:

- Shared domain contracts exist in `@threadkit/domain`.
- The local thread math and preview generation exist in `@threadkit/core-engine`.
- The Angular UI can edit thread parameters and show preview, warnings, recommendations, and score without Fusion.
- The basic Fusion host scaffold exists in the repo, but it is not yet the source of truth for live runtime behavior in the mock baseline.

This means the project is not at zero. The parameter model, preview DTOs, and the first usable UX shell already exist. What is still missing is the full transition from a local mock design tool into a real Fusion-integrated thread authoring tool.

## What Is Already Good Enough In The Mock Version

These areas are not the current blocker:

- Editing core thread parameters in the UI
- Editing print settings in the UI
- Generating 2D profile preview
- Generating 3D helix sample preview
- Generating layer-oriented preview slices
- Producing warnings, recommendations, and a score from local logic
- Keeping contracts and preview math in reusable TypeScript packages

This is important because it means we do not need to rebuild the conceptual thread design flow from scratch. We mainly need to connect it to a real CAD runtime and complete the missing build path.

## Work That Still Must Be Completed For The MVP

### 1. Finish The Runtime Boundary Between UI And Fusion

The mock UI is still mainly a local application. For the actual MVP, the UI must become a palette that talks to Fusion as the runtime authority.

This area still requires:

- Finalize the message protocol between UI and host
- Ensure all host actions are stable and typed
- Make the Fusion host the real provider of selection context
- Make the UI resilient when the host is unavailable or returns errors
- Decide which operations are synchronous enough for interactive preview and which need explicit user actions

Minimum done criteria:

- The palette can send requests to Fusion and receive typed responses reliably
- Error states are visible and recoverable
- The same UI can run in browser-dev mode and in Fusion mode without divergent logic

### 2. Replace Mock Selection With Real Fusion Selection Context

Right now the mock baseline can present selection information, but for the real tool we need true selection extraction from Fusion.

This area still requires:

- Reading the selected face or body from Fusion
- Detecting whether the target is a likely internal or external thread candidate
- Extracting diameter, available thread length, axis direction, and axis origin
- Handling invalid or unsupported selections cleanly
- Refreshing the palette when selection changes

Minimum done criteria:

- The user can select valid geometry in Fusion and the palette reflects it correctly
- Invalid selection states are clearly explained
- Selection-driven validation meaningfully changes the preview and commit readiness

### 3. Move Preview From Local Mock Rendering To Live Fusion Preview

The preview logic in TypeScript is already useful, but the final tool needs a real preview inside Fusion, not only in the web UI.

This area still requires:

- Mapping preview DTOs into Fusion preview structures
- Rendering temporary or custom-graphics preview geometry in Fusion
- Cleaning preview artifacts between updates
- Handling rapid parameter changes without leaving stale preview state
- Deciding the final preview strategy for profile, helix, and thread extent visualization

Minimum done criteria:

- Changing parameters in the palette updates visible preview in Fusion
- Preview redraw is stable across repeated edits
- Cancelling or closing the palette clears temporary preview state

### 4. Implement Real Commit Geometry In Fusion

This is the biggest missing area. The mock version can describe a thread, but the MVP is not complete until the tool can create real geometry in the Fusion model.

This area still requires:

- Building the sweep path in Fusion
- Building the thread profile sketch in Fusion
- Creating the actual sweep or equivalent geometry operation
- Applying the correct boolean operation for external vs internal thread
- Creating a predictable feature result in the Fusion timeline
- Returning a structured commit result back to the UI

Minimum done criteria:

- External thread creation works end to end in a real Fusion document
- The created geometry is stable enough for repeated testing
- Commit errors are reported with useful messages

### 5. Finish Internal Thread Support

Even if the first real build path starts with external threads, the MVP is not actually done until internal thread behavior is also covered.

This area still requires:

- Valid internal target detection
- Internal-specific geometry path and boolean behavior
- Validation rules that reflect internal-thread constraints
- Testing against realistic internal thread scenarios

Minimum done criteria:

- Internal and external thread flows both work in Fusion
- The UI and host consistently understand which mode is valid for the current selection

### 6. Harden Validation, Recovery, And UX States

The mock version already has useful validation, but the production-facing MVP needs much stronger runtime behavior around failure and edge cases.

This area still requires:

- Distinguishing warnings from true blocking errors
- Better field-level feedback for bad thread values
- Better host-side error envelopes
- Recoverable behavior after preview or commit failure
- Empty-state UX when there is no valid selection
- Loading and busy states around preview and commit operations

Minimum done criteria:

- A failed preview or failed commit does not force the user to restart the tool
- The user can understand what is wrong and how to fix it
- The palette remains stable under invalid inputs and invalid selections

### 7. Add Recent Config And Session Quality-Of-Life Features

This is not the core of thread geometry, but it is part of making the tool usable enough to demo and iterate with confidence.

This area still requires:

- Saving the most recent configuration
- Loading recent configuration back into the palette
- Preserving a useful amount of user state across sessions
- Deciding whether recent config is global, per document, or per user

Minimum done criteria:

- The user can recover a recent working configuration quickly
- State persistence does not corrupt future runs

### 8. Add Regression Coverage Around Core And Host Behavior

The core math already has some tests, but the full MVP needs more confidence around integration behavior.

This area still requires:

- More fixtures for representative thread specs
- Regression tests for selection-driven validation
- Regression tests for preview-result payloads
- Smoke tests for host request handlers
- Validation that build plans remain structurally stable

Minimum done criteria:

- A meaningful test run catches accidental regressions in contracts or preview/build logic
- Core and host integration changes can be made without blind guessing

## What Still Belongs To Core Logic Vs What Is Pure Fusion Work

To avoid confusion later, here is the clean split.

### Core Logic Still Owned By TypeScript Packages

These areas should remain in shared TypeScript logic as much as possible:

- Thread spec normalization
- Validation rules
- Profile generation math
- Helix path sampling
- Printability heuristics
- Preview DTO generation
- Commit/build-plan DTO structure

If we keep these in shared code, the UI remains fast to iterate and the Fusion host stays thinner.

### Pure Fusion Host Work

These areas only become real inside Fusion:

- Reading live selection from the model
- Rendering preview geometry in the canvas
- Creating sketches, paths, sweeps, and boolean operations
- Managing document-side cleanup
- Working with timeline, undo behavior, and feature ownership

This distinction matters because after the mock baseline, not everything remaining is "just Fusion plumbing". Some of the remaining work is still shared product logic and UX-hardening, while the rest is genuinely CAD-host-specific.

## Recommended Next Milestones After UI Detour

When we return to the main ThreadKit flow, the healthiest path is:

1. Restore the stashed host/bridge work and review it against the mock baseline.
2. Reconfirm the contract boundary for preview, commit, selection, and errors.
3. Finish live selection sync first.
4. Finish live preview in Fusion second.
5. Finish real external-thread commit third.
6. Finish internal-thread commit and hardening after that.
7. Close the loop with regression tests and recent-config polish.

This order keeps the riskiest geometry work from starting too early, while still moving steadily toward a real usable add-in.

## Explicitly Not Required To Call The MVP Complete

These items are still valuable, but they should not block the MVP finish line:

- Multi-start thread generation
- Tapered thread families
- Pipe thread standards
- Full slicer simulation
- Automatic production installer flow
- Multiple CAD host support
- Major refactor or language migration

## Practical Reminder

If development temporarily shifts toward UI polish or unrelated work, this document should be treated as the return point for the main ThreadKit effort.

The key truth to preserve is:

The mock baseline already solves a meaningful part of thread design and preview, but the project is only fully complete once the Fusion runtime owns selection, preview, and geometry commit end to end.
