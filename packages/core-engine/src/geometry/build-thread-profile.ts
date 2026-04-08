import type { Point2, ThreadSpec } from "@threadkit/domain";

import { normalizeThreadSpec } from "../spec/normalize-thread-spec.js";
import { round } from "../utils/round.js";

export interface ThreadProfileMetrics {
  threadDepthMm: number;
  crestWidthMm: number;
  rootWidthMm: number;
}

export interface ThreadProfileResult {
  profilePoints: Point2[];
  metrics: ThreadProfileMetrics;
}

export function buildThreadProfile(input: ThreadSpec): ThreadProfileResult {
  const spec = normalizeThreadSpec(input);
  const pitch = spec.pitchMm;
  const crestWidth = round(pitch * ((spec.crestFlatPercent ?? 0) / 100));
  const rootWidth = round(pitch * ((spec.rootFlatPercent ?? 0) / 100));
  const flankRun = Math.max((pitch - crestWidth - rootWidth) / 2, pitch * 0.05);
  const depth = round(
    Math.min(baseDepth(spec), flankRun / Math.tan(toRadians(spec.flankAngleDeg ?? 30)))
  );
  const halfPitch = pitch / 2;
  const halfRoot = rootWidth / 2;

  return {
    profilePoints: [
      { x: round(-halfPitch), y: 0 },
      { x: round(-halfRoot - flankRun), y: 0 },
      { x: round(-halfRoot), y: round(-depth) },
      { x: round(halfRoot), y: round(-depth) },
      { x: round(halfRoot + flankRun), y: 0 },
      { x: round(halfPitch), y: 0 }
    ],
    metrics: {
      threadDepthMm: depth,
      crestWidthMm: crestWidth,
      rootWidthMm: rootWidth
    }
  };
}

function baseDepth(spec: ThreadSpec): number {
  switch (spec.profileShape) {
    case "triangular":
      return spec.pitchMm * 0.613;
    case "trapezoidal":
      return spec.pitchMm * 0.52;
    case "squareLike":
      return spec.pitchMm * 0.44;
    default:
      return spec.pitchMm * 0.52;
  }
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}
