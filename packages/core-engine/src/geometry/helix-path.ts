import type { Handedness, Point3 } from "@threadkit/domain";

import { round } from "../utils/round.js";

export interface HelixPathParams {
  radiusMm: number;
  pitchMm: number;
  lengthMm: number;
  handedness: Handedness;
  pointsPerTurn?: number;
}

export function sampleHelixPath(params: HelixPathParams): Point3[] {
  const turns = Math.max(params.lengthMm / params.pitchMm, 1);
  const pointsPerTurn = Math.max(Math.trunc(params.pointsPerTurn ?? 24), 8);
  const sampleCount = Math.max(Math.ceil(turns * pointsPerTurn) + 1, 2);
  const direction = params.handedness === "left" ? -1 : 1;

  return Array.from({ length: sampleCount }, (_, index) => {
    const ratio = index / (sampleCount - 1);
    const angle = ratio * turns * Math.PI * 2 * direction;

    return {
      x: round(Math.cos(angle) * params.radiusMm),
      y: round(Math.sin(angle) * params.radiusMm),
      z: round(ratio * params.lengthMm)
    };
  });
}
