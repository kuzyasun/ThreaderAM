import type { PreviewResult, PrintSettings, ThreadSpec } from "@threadkit/domain";

import { sampleHelixPath } from "../geometry/helix-path.js";
import { normalizeThreadSpec } from "../spec/normalize-thread-spec.js";
import { round } from "../utils/round.js";
import { validateThreadSpec } from "../validation/validate-thread-spec.js";

export function buildHelixPreview(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
}): PreviewResult {
  const spec = normalizeThreadSpec(args.spec);
  const turns = spec.lengthMm / spec.pitchMm;

  return {
    helix3d: {
      pathPoints: sampleHelixPath({
        radiusMm: spec.majorDiameterMm / 2,
        pitchMm: spec.pitchMm,
        lengthMm: spec.lengthMm,
        handedness: spec.handedness
      }),
      turnCount: round(turns, 2)
    },
    issues: validateThreadSpec(spec),
    recommendations: []
  };
}
