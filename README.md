# ThreaderAM

ThreaderAM is the working repository for the ThreadKit MVP scaffold.

## Workspace

This repository is organized as a pnpm monorepo:

- `apps/fusion-host` contains the Autodesk Fusion add-in skeleton.
- `packages/domain` holds shared contracts and DTO boundaries.
- `packages/core-engine` is the future home for thread geometry and printability logic.
- `packages/ui-web` contains the Angular palette application.
- `packages/test-cases` stores fixtures and golden outputs.
- `packages/dev-tools` contains helper scripts for development workflows.

## Getting Started

```bash
pnpm install
pnpm build
pnpm typecheck
```

Run the Angular palette locally:

```bash
pnpm --filter @threadkit/ui-web start
```

## Current Status

P1 scaffold is in place. The next step is defining shared domain contracts and wiring the first end-to-end DTO flow.
