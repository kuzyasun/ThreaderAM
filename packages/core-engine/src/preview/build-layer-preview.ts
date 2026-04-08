import type {
  HostSelectionContext,
  PreviewResult,
  PrintSettings,
  ThreadSpec,
  ValidationIssue
} from "@threadkit/domain";

import { analyzeFlankPrintability } from "../printability/analyze-flank-printability.js";
import { recommendThreadSettings } from "../printability/recommend-thread-settings.js";
import { normalizeThreadSpec } from "../spec/normalize-thread-spec.js";
import { clamp, round } from "../utils/index.js";
import { validateThreadSpec } from "../validation/validate-thread-spec.js";

export function buildLayerPreview(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
  selectionContext?: HostSelectionContext;
}): PreviewResult {
  const spec = normalizeThreadSpec(args.spec);
  const issues = [
    ...validateThreadSpec(spec),
    ...analyzeFlankPrintability({ spec, printSettings: args.printSettings }),
    ...validateSelectionLength(spec, args.selectionContext)
  ];
  return {
    layerSlices: buildSlices(spec, args.printSettings),
    issues,
    recommendations: recommendThreadSettings({
      spec,
      printSettings: args.printSettings,
      selectionContext: args.selectionContext
    }),
    score: clamp(
      round(
        92 -
          issues.filter((issue) => issue.severity === "error").length * 24 -
          issues.filter((issue) => issue.severity === "warning").length * 10 -
          (spec.profileShape === "squareLike" ? 6 : 0) -
          (args.printSettings.layerHeightMm > 0.28 ? 8 : 0),
        0
      ),
      20,
      98
    )
  };
}

function buildSlices(spec: ThreadSpec, printSettings: PrintSettings): PreviewResult["layerSlices"] {
  const sliceCount = 4;
  const depth =
    spec.profileShape === "triangular"
      ? spec.pitchMm * 0.613
      : spec.profileShape === "trapezoidal"
        ? spec.pitchMm * 0.52
        : spec.pitchMm * 0.44;

  return Array.from({ length: sliceCount }, (_, index) => {
    const ratio = index / Math.max(sliceCount - 1, 1);
    const width = Math.max(spec.pitchMm * (1 - ratio * 0.45), printSettings.nozzleDiameterMm);
    const shoulder = width * 0.18;

    return {
      index,
      zMm: round(index * printSettings.layerHeightMm),
      segments: [
        {
          start: { x: round(-width / 2), y: round(ratio * depth * 0.25) },
          end: { x: round(-shoulder), y: round(depth * (0.6 + ratio * 0.2)) }
        },
        {
          start: { x: round(-shoulder), y: round(depth * (0.6 + ratio * 0.2)) },
          end: { x: round(shoulder), y: round(depth * (0.6 + ratio * 0.2)) }
        },
        {
          start: { x: round(shoulder), y: round(depth * (0.6 + ratio * 0.2)) },
          end: { x: round(width / 2), y: round(ratio * depth * 0.25) }
        }
      ]
    };
  });
}

function validateSelectionLength(
  spec: ThreadSpec,
  selectionContext?: HostSelectionContext
): ValidationIssue[] {
  if (
    selectionContext?.availableLengthMm !== undefined &&
    spec.lengthMm > selectionContext.availableLengthMm
  ) {
    return [
      {
        code: "selection.length.exceeded",
        severity: "error",
        field: "lengthMm",
        message: "Requested thread length exceeds the available host selection length."
      }
    ];
  }

  return [];
}
