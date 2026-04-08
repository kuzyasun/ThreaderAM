# ThreadKit Implementation Plan

This document captures the working implementation plan for the ThreadKit MVP so it stays aligned with the repository.

## Phase Breakdown

### P1. Repo Scaffold

Scope:

- Create the pnpm workspace and shared root configuration.
- Add initial package folders for `domain`, `core-engine`, `ui-web`, `test-cases`, and `dev-tools`.
- Add the Fusion host skeleton.
- Add a minimal Angular palette shell.

Definition of done:

- `pnpm install` succeeds.
- `pnpm build`, `pnpm typecheck`, and `pnpm test` succeed.
- The repository has a stable base structure for future phases.

### P2. Domain Contracts

Scope:

- Define shared DTO contracts.
- Add enums and reusable geometry/value types.
- Add runtime schemas for key contracts.
- Define bridge action names and message envelope types.

Definition of done:

- `@threadkit/domain` exports a stable API.
- Runtime validation exists for the core DTO boundary.
- UI, core, and host can all consume the same contract package.

### P3. UI Shell on Mock Data

Scope:

- Build the main Angular shell and feature sections.
- Add mock-driven state for thread editing and preview panels.
- Add the first warnings and recommendations layout.

Definition of done:

- The UI runs independently from Fusion.
- Core screen sections exist and can be exercised with mock data.

### P4. Core Engine v1

Scope:

- Implement `normalizeThreadSpec`.
- Implement `buildThreadProfile`.
- Implement `sampleHelixPath`.
- Add basic printability heuristics and validation.
- Add fixtures and tests.

Definition of done:

- The core package provides real thread math and validation.
- Tests cover the first golden paths.

### P5. UI and Core Integration

Scope:

- Replace mock calculations with calls into `core-engine`.
- Wire the UI form state to real preview DTOs.
- Surface warnings, recommendations, and quality score from the core layer.

Definition of done:

- The palette works locally against real TypeScript domain and core logic.

### P6. Fusion Host Skeleton and Bridge

Scope:

- Register the Fusion command.
- Open the palette in dev and prod modes.
- Add the async JSON bridge.
- Implement `host.ping` and `host.getSelectionContext`.

Definition of done:

- The add-in launches in Fusion and exchanges structured messages with the palette.

### P7. Preview Pipeline in Fusion

Scope:

- Implement `host.previewThread`.
- Map DTOs to Fusion preview input.
- Add selection reading and preview rendering.
- Return `ui.previewResult`.

Definition of done:

- Parameter changes in the palette can produce live preview feedback in Fusion.

### P8. Commit Geometry v1

Scope:

- Implement `host.commitThread`.
- Build the first external thread geometry path.
- Add sweep/profile/boolean integration.

Definition of done:

- The MVP can commit a working external thread into the Fusion model.

### P9. Internal Thread and Hardening

Scope:

- Add internal thread support.
- Add recent configs.
- Improve validation and error handling.
- Add regression coverage and cleanup polish.

Definition of done:

- External and internal thread flows both work end to end.

## Execution Order

The intended order is:

`P1 -> P2 -> P3 -> P4 -> P5 -> P6 -> P7 -> P8 -> P9`

## Explicitly Deferred

These items stay out of scope until after the MVP is stable:

- Multi-start threads
- Tapered and pipe thread families
- Full slicer simulation
- Additional CAD hosts
- Production installer and updater work
- Rust migration implementation
