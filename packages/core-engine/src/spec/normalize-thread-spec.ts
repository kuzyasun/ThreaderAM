import type { ThreadSpec } from "@threadkit/domain";

import {
  defaultCrestFlatPercent,
  defaultFlankAngleDeg,
  defaultManualClearanceMm,
  defaultRootFlatPercent
} from "./defaults.js";

export function normalizeThreadSpec(input: ThreadSpec): ThreadSpec {
  const threadStandard = input.threadStandard ?? "custom";
  const depthMode = threadStandard === "custom" ? input.depthMode ?? "auto" : "auto";

  return {
    ...input,
    threadStandard,
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
    depthMode,
    manualDepthMm:
      threadStandard === "custom" && depthMode === "manual"
        ? toPositive(input.manualDepthMm, defaultDerivedDepth(input))
        : undefined,
    manualClearanceMm:
      input.clearanceMode === "manual"
        ? toPositive(input.manualClearanceMm, defaultManualClearanceMm())
        : undefined
  };
}

function defaultDerivedDepth(input: ThreadSpec): number {
  switch (input.profileShape) {
    case "triangular":
      return toPositive(input.pitchMm, 0.1) * 0.613;
    case "squareLike":
      return toPositive(input.pitchMm, 0.1) * 0.44;
    case "trapezoidal":
    default:
      return toPositive(input.pitchMm, 0.1) * 0.52;
  }
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
