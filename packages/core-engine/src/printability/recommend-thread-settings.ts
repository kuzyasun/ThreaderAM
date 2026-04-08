import type { HostSelectionContext, PrintSettings, Recommendation, ThreadSpec } from "@threadkit/domain";

export function recommendThreadSettings(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
  selectionContext?: HostSelectionContext;
}): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (args.spec.profileShape === "triangular") {
    recommendations.push({
      code: "profile.swap.trapezoid",
      title: "Consider trapezoidal flanks",
      details: "A trapezoidal profile typically preserves crest support better on utility FDM threads.",
      priority: "medium"
    });
  }

  if (args.printSettings.materialFamily === "PETG") {
    recommendations.push({
      code: "material.petg.clearance",
      title: "Bias clearance upward for PETG",
      details: "PETG often runs tackier on mating surfaces, so it benefits from slightly looser fits.",
      priority: "high"
    });
  }

  if ((args.selectionContext?.cylinderDiameterMm ?? 0) >= 30) {
    recommendations.push({
      code: "preview.large-diameter",
      title: "Check the first turn before commit",
      details: "Large diameters magnify profile proportion errors, so previewing the first turn is worth it.",
      priority: "low"
    });
  }

  if (args.spec.lengthMm > 18) {
    recommendations.push({
      code: "build.lead-in",
      title: "Plan a lead-in for the final build",
      details: "Longer threads usually feel better in use if the build stage includes a gentle entry chamfer.",
      priority: "medium"
    });
  }

  return recommendations;
}
