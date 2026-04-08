import type { PrintSettings, ThreadSpec, ValidationIssue } from "@threadkit/domain";

import { buildThreadProfile } from "../geometry/build-thread-profile.js";

export function analyzeFlankPrintability(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
}): ValidationIssue[] {
  const { metrics } = buildThreadProfile(args.spec);
  const { printSettings, spec } = args;
  const issues: ValidationIssue[] = [];

  if (spec.pitchMm < printSettings.nozzleDiameterMm * 1.15) {
    issues.push({
      code: "print.pitch.tight",
      severity: "warning",
      field: "pitchMm",
      message: "Pitch is tight relative to the active nozzle and may soften flank detail."
    });
  }

  if (printSettings.layerHeightMm > spec.pitchMm * 0.38) {
    issues.push({
      code: "print.layer.coarse",
      severity: "warning",
      field: "layerHeightMm",
      message: "Layer height is coarse for this pitch and will accent stair-stepping across the flanks."
    });
  }

  if (metrics.crestWidthMm < printSettings.nozzleDiameterMm * 0.85) {
    issues.push({
      code: "print.crest.thin",
      severity: "warning",
      field: "crestFlatPercent",
      message: "Crest width is narrow for a stable bead and may print with rounded tops."
    });
  }

  if (metrics.threadDepthMm < printSettings.layerHeightMm * 1.1) {
    issues.push({
      code: "print.depth.shallow",
      severity: "warning",
      field: "pitchMm",
      message: "Thread depth is shallow relative to layer height and the profile may wash out."
    });
  }

  return issues;
}
