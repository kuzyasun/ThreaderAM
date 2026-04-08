import type { PreviewResult, PrintSettings, ThreadSpec } from "@threadkit/domain";

import { buildThreadProfile } from "../geometry/build-thread-profile.js";
import { analyzeFlankPrintability } from "../printability/analyze-flank-printability.js";
import { recommendThreadSettings } from "../printability/recommend-thread-settings.js";
import { validateThreadSpec } from "../validation/validate-thread-spec.js";

export function buildProfilePreview(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
}): PreviewResult {
  const { profilePoints, metrics } = buildThreadProfile(args.spec);

  return {
    profile2d: {
      profilePoints,
      dimensionsMm: {
        threadDepth: metrics.threadDepthMm,
        crestWidth: metrics.crestWidthMm,
        rootWidth: metrics.rootWidthMm
      }
    },
    issues: [...validateThreadSpec(args.spec), ...analyzeFlankPrintability(args)],
    recommendations: recommendThreadSettings(args)
  };
}
