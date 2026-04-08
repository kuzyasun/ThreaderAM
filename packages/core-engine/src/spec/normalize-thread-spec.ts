import type { ThreadSpec } from "@threadkit/domain";

import {
  defaultCrestFlatPercent,
  defaultFlankAngleDeg,
  defaultManualClearanceMm,
  defaultRootFlatPercent
} from "./defaults.js";

export function normalizeThreadSpec(input: ThreadSpec): ThreadSpec {
  return {
    ...input,
    majorDiameterMm: toPositive(input.majorDiameterMm, 1),
    pitchMm: toPositive(input.pitchMm, 0.1),
    lengthMm: toPositive(input.lengthMm, 0.5),
    starts: Math.max(Math.trunc(input.starts), 1),
    crestFlatPercent: normalizePercent(
      input.crestFlatPercent,
      defaultCrestFlatPercent(input.profileShape)
    ),
    rootFlatPercent: normalizePercent(
      input.rootFlatPercent,
      defaultRootFlatPercent(input.profileShape)
    ),
    flankAngleDeg: toPositive(input.flankAngleDeg, defaultFlankAngleDeg(input.profileShape)),
    manualClearanceMm:
      input.clearanceMode === "manual"
        ? toPositive(input.manualClearanceMm, defaultManualClearanceMm())
        : undefined
  };
}

function normalizePercent(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(value, 0), 100);
}

function toPositive(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}
