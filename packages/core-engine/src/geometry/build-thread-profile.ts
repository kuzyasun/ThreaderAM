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
  const requestedDepth =
    spec.threadStandard === "custom" && spec.depthMode === "manual"
      ? spec.manualDepthMm ?? baseDepth(spec)
      : baseDepth(spec);
  const shape = buildShape(spec, requestedDepth);

  return {
    profilePoints: shape.profilePoints,
    metrics: {
      threadDepthMm: shape.depthMm,
      crestWidthMm: shape.crestWidthMm,
      rootWidthMm: shape.rootWidthMm
    }
  };
}

interface ShapeProfileResult {
  profilePoints: Point2[];
  depthMm: number;
  crestWidthMm: number;
  rootWidthMm: number;
}

function buildShape(spec: ThreadSpec, requestedDepth: number): ShapeProfileResult {
  switch (spec.profileShape) {
    case "triangular":
      return buildTriangularProfile(spec, requestedDepth);
    case "squareLike":
      return buildSquareLikeProfile(spec, requestedDepth);
    case "trapezoidal":
    default:
      return buildTrapezoidalProfile(spec, requestedDepth);
  }
}

function buildTriangularProfile(spec: ThreadSpec, requestedDepth: number): ShapeProfileResult {
  const pitch = spec.pitchMm;
  const halfPitch = pitch / 2;
  const crestWidth = round(Math.min(pitch * ((spec.crestFlatPercent ?? 0) / 100), pitch * 0.28));
  const halfCrest = crestWidth / 2;
  const flankRun = Math.max((pitch - crestWidth) / 2, pitch * 0.08);
  const depth = clampDepth(requestedDepth, flankRun, spec.flankAngleDeg ?? 30);

  return {
    profilePoints: [
      { x: round(-halfPitch), y: 0 },
      { x: round(-halfCrest), y: 0 },
      { x: 0, y: round(-depth) },
      { x: round(halfCrest), y: 0 },
      { x: round(halfPitch), y: 0 }
    ],
    depthMm: depth,
    crestWidthMm: crestWidth,
    rootWidthMm: 0
  };
}

function buildTrapezoidalProfile(spec: ThreadSpec, requestedDepth: number): ShapeProfileResult {
  const pitch = spec.pitchMm;
  const halfPitch = pitch / 2;
  const crestWidth = round(pitch * ((spec.crestFlatPercent ?? 0) / 100));
  const rootWidth = round(pitch * ((spec.rootFlatPercent ?? 0) / 100));
  const flankRun = Math.max((pitch - crestWidth - rootWidth) / 2, pitch * 0.05);
  const depth = clampDepth(requestedDepth, flankRun, spec.flankAngleDeg ?? 30);
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
    depthMm: depth,
    crestWidthMm: crestWidth,
    rootWidthMm: rootWidth
  };
}

function buildSquareLikeProfile(spec: ThreadSpec, requestedDepth: number): ShapeProfileResult {
  const pitch = spec.pitchMm;
  const halfPitch = pitch / 2;
  const crestWidth = round(pitch * ((spec.crestFlatPercent ?? 0) / 100));
  const rootWidth = round(Math.max(pitch * ((spec.rootFlatPercent ?? 0) / 100), pitch * 0.34));
  const flankShoulder = Math.max((pitch - crestWidth - rootWidth) / 2, pitch * 0.04);
  const wallRun = Math.max(Math.min(flankShoulder * 0.35, pitch * 0.08), pitch * 0.025);
  const depth = clampDepth(requestedDepth, wallRun, spec.flankAngleDeg ?? 30);
  const halfRoot = rootWidth / 2;

  return {
    profilePoints: [
      { x: round(-halfPitch), y: 0 },
      { x: round(-halfRoot - wallRun), y: 0 },
      { x: round(-halfRoot), y: round(-depth) },
      { x: round(halfRoot), y: round(-depth) },
      { x: round(halfRoot + wallRun), y: 0 },
      { x: round(halfPitch), y: 0 }
    ],
    depthMm: depth,
    crestWidthMm: crestWidth,
    rootWidthMm: rootWidth
  };
}

function clampDepth(requestedDepth: number, flankRun: number, flankAngleDeg: number): number {
  return round(Math.min(requestedDepth, flankRun / Math.tan(toRadians(flankAngleDeg))));
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
