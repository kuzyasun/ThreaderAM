# AGENTS

## Purpose
- Monorepo for the ThreadKit MVP scaffold: Autodesk Fusion host, shared TypeScript contracts, future core engine, Angular palette UI, fixtures, and helper scripts.
- Optimize for quality first, then token economy. Prefer verification over guessing and small diffs over broad rewrites.
- Current repo state is scaffold-first. Several docs describe target architecture beyond what is implemented today.

## Repository map
- `apps/fusion-host/`
  - Fusion host package.
  - `addin/ThreadKit.py` is the Python add-in entrypoint.
  - `addin/ThreadKit.manifest` is the add-in identity and host metadata source of truth.
  - `addin/resources/web-dist/` is generated palette build output for Fusion deployment; keep only `.gitkeep` in git.
- `packages/domain/`
  - Shared DTOs, enums, bridge actions, types, and zod schemas.
  - Current cross-package contract source of truth.
- `packages/core-engine/`
  - Pure TypeScript core package for geometry, validation, and printability logic.
  - Currently scaffolded; expect this package to stay host-agnostic.
- `packages/ui-web/`
  - Angular 21 palette application.
- `packages/test-cases/`
  - Fixtures and golden outputs; currently placeholder directories.
- `packages/dev-tools/`
  - Helper scripts for UI-to-Fusion workflows; current scripts are stubs.
- `docs/`
  - Planning and architecture notes.
  - `threadkit-implementation-plan.md` is the clearest current phase plan.
  - `threadkit-mvp-structure.md` and `fusion-threadkit-mvp-plan.md` describe intended architecture; do not assume every path in them already exists.

## Stack summary
- `pnpm@10.32.1` workspace via `pnpm-workspace.yaml`
- TypeScript 5.9 with strict settings
- NodeNext/ESM packages in `packages/domain` and `packages/core-engine`
- Angular 21 via Angular CLI and `@angular/build`
- Zod for runtime contract validation in `packages/domain`
- Vitest for `packages/core-engine`
- Python Fusion add-in scaffold in `apps/fusion-host/addin`
- No repo CI, Docker, devcontainer, lint, or formatter config beyond `.editorconfig`

## Canonical commands
- Install: `pnpm install`
- Root validation:
  - `pnpm build`
  - `pnpm typecheck`
  - `pnpm test`
- UI dev server:
  - `pnpm start:ui`
  - `pnpm --filter @threadkit/ui-web start`
- Package-scoped:
  - `pnpm --filter @threadkit/domain build`
  - `pnpm --filter @threadkit/domain typecheck`
  - `pnpm --filter @threadkit/core-engine build`
  - `pnpm --filter @threadkit/core-engine typecheck`
  - `pnpm --filter @threadkit/core-engine test`
  - `pnpm --filter @threadkit/ui-web build`
  - `pnpm --filter @threadkit/ui-web typecheck`
- Targeted core test execution:
  - `pnpm --filter @threadkit/core-engine exec vitest run <path-to-test>`
- No canonical `lint` or `format` command is configured; do not invent one in summaries or plans.

## Source of truth
- Root workflow and status:
  - `README.md`
  - `package.json`
  - `pnpm-workspace.yaml`
  - `tsconfig.base.json`
- Style and generated-file rules:
  - `.editorconfig`
  - `.gitignore`
- Contracts and bridge API:
  - `packages/domain/src/contracts/`
  - `packages/domain/src/enums/`
  - `packages/domain/src/messaging/actions.ts`
  - `packages/domain/src/schemas/`
- UI conventions:
  - `packages/ui-web/package.json`
  - `packages/ui-web/angular.json`
  - `packages/ui-web/src/app/`
- Fusion host entrypoints:
  - `apps/fusion-host/README.md`
  - `apps/fusion-host/addin/ThreadKit.py`
  - `apps/fusion-host/addin/ThreadKit.manifest`
- Architecture and roadmap intent:
  - `docs/threadkit-implementation-plan.md`
  - `docs/threadkit-mvp-structure.md`
  - `docs/fusion-threadkit-mvp-plan.md`

## Working rules
- Make minimal, package-local changes. Do not rewrite unrelated scaffold files.
- Preserve package boundaries:
  - `packages/domain` owns DTOs, enums, actions, schemas, and shared types.
  - `packages/core-engine` should stay CAD-host-agnostic.
  - `packages/ui-web` should consume generic contracts, not Fusion API details.
  - `apps/fusion-host` should stay a thin adapter around Fusion lifecycle, selection, palette, preview, and commit integration.
- When changing contracts, update all related pieces together:
  - contract type
  - enum or action constants
  - zod schema
  - package exports
  - direct consumers
- In TypeScript ESM packages, keep explicit relative `.js` extensions in source imports to match the NodeNext setup.
- Follow nearby code patterns before introducing new structure. Extend the scaffold incrementally.
- Do not add dependencies or new tooling without strong justification.
- Update docs, fixtures, or tests when behavior or public contracts change.

## Task sizing and workflow
- Simple task:
  - inspect the touched package manifest, config, and nearby source files
  - implement directly
  - run the smallest relevant validation
- Medium or complex task:
  - start with a short plan
  - break work into milestones by package or boundary
  - validate after each milestone with the narrowest useful command

## Context strategy
- Start from the nearest files, then widen only as needed:
  - touched file
  - sibling files
  - package `package.json`
  - package tsconfig or framework config
- Search the repo before asking the user.
- Treat docs in layers:
  - use `docs/threadkit-implementation-plan.md` for phase order and current intended scope
  - use `docs/threadkit-mvp-structure.md` and `docs/fusion-threadkit-mvp-plan.md` for target architecture
  - let current tracked source win over aspirational folder sketches
- If one area grows substantially, prefer a local override file there instead of expanding this root guide.

## Validation strategy
- Cross-package or shared-contract changes:
  - run `pnpm build`
  - run `pnpm typecheck`
  - run `pnpm test`
- `packages/domain` changes:
  - run `pnpm --filter @threadkit/domain build`
  - run `pnpm --filter @threadkit/domain typecheck`
- `packages/core-engine` changes:
  - run `pnpm --filter @threadkit/core-engine typecheck`
  - run `pnpm --filter @threadkit/core-engine test`
  - also run `build` if exports or compile output changed
- `packages/ui-web` changes:
  - run `pnpm --filter @threadkit/ui-web typecheck`
  - run `pnpm --filter @threadkit/ui-web build` for template, build, or asset-path changes
- `apps/fusion-host` changes:
  - no repo-level automated Fusion validation command exists
  - validate only what is locally possible
  - explicitly say what could not be exercised in Fusion
- Prefer targeted checks first; escalate to root commands when changes cross package boundaries.

## Safety and guardrails
- Do not edit generated outputs in `dist/`, `.angular/`, `coverage/`, or `apps/fusion-host/addin/resources/web-dist/`; regenerate them when needed.
- Keep `apps/fusion-host/addin/resources/web-dist/.gitkeep`.
- `packages/domain` is the main breaking-change hotspot; renaming fields, enums, or bridge actions affects UI, core, and host.
- Treat `apps/fusion-host/addin/ThreadKit.manifest` changes as integration-impacting.
- Prefer reusable fixture or golden files under `packages/test-cases/src/fixtures/` and `packages/test-cases/src/golden/` over ad hoc inline test data when coverage starts growing.
- Keep secrets, machine-specific paths, and local Fusion setup details out of tracked files.

## When to ask the user
- Ask only when ambiguity would materially change:
  - public DTOs or bridge action names
  - manifest or package identity
  - package boundaries
  - dependency/tooling choices
  - deployment workflow into Fusion
- Ask when real Fusion runtime behavior is required and cannot be verified from the repo.
- Otherwise, make a reasonable assumption and proceed.

## Optional nested overrides
- `apps/fusion-host/addin/AGENTS.override.md`
  - Add once Fusion command, palette, preview, and build logic need host-specific lifecycle and manual-validation guidance.
- `packages/ui-web/AGENTS.override.md`
  - Add once the Angular app grows component, state, and styling conventions beyond the current shell.
- `packages/core-engine/AGENTS.override.md`
  - Add once geometry, heuristics, and fixture-driven tests become substantial enough to need package-specific rules.
- `packages/domain/AGENTS.override.md`
  - Add once contract evolution and compatibility rules become more complex than the current single-package boundary.
