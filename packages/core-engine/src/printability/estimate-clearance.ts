import type { PrintSettings, ThreadSpec } from "@threadkit/domain";

import { normalizeThreadSpec } from "../spec/normalize-thread-spec.js";
import { round } from "../utils/round.js";

export interface ClearanceEstimate {
  recommendedClearanceMm: number;
  rationale: string[];
}

export function estimateFdmClearance(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
}): ClearanceEstimate {
  const spec = normalizeThreadSpec(args.spec);
  const { printSettings } = args;

  let clearance =
    printSettings.nozzleDiameterMm * 0.18 +
    printSettings.layerHeightMm * 0.35 +
    materialBias(printSettings.materialFamily);

  const rationale = [
    `Base clearance scales from nozzle ${printSettings.nozzleDiameterMm} mm and layer height ${printSettings.layerHeightMm} mm.`,
    `${printSettings.materialFamily} adds a material bias of ${materialBias(printSettings.materialFamily).toFixed(2)} mm.`
  ];

  if (spec.operationMode === "internal") {
    clearance += 0.02;
    rationale.push("Internal threads receive a small extra bias for safer mating clearance.");
  }

  if (spec.profileShape === "squareLike") {
    clearance += 0.02;
    rationale.push("Square-like profiles benefit from a little more clearance on flat contact regions.");
  }

  return {
    recommendedClearanceMm: round(clearance, 3),
    rationale
  };
}

function materialBias(materialFamily: PrintSettings["materialFamily"]): number {
  switch (materialFamily) {
    case "PLA":
      return 0.02;
    case "PETG":
      return 0.05;
    case "ABS_ASA":
      return 0.04;
    case "PA_CF":
      return 0.06;
    case "TPU":
      return 0.12;
    default:
      return 0.04;
  }
}
