import type { ThreadSpec, ValidationIssue } from "@threadkit/domain";

import { normalizeThreadSpec } from "../spec/normalize-thread-spec.js";

export function validateThreadSpec(input: ThreadSpec): ValidationIssue[] {
  const spec = normalizeThreadSpec(input);
  const issues: ValidationIssue[] = [];

  if (spec.pitchMm >= spec.majorDiameterMm) {
    issues.push({
      code: "thread.pitch.too-large",
      severity: "error",
      field: "pitchMm",
      message: "Pitch must stay below the major diameter for a valid cylindrical thread."
    });
  }

  if (spec.lengthMm < spec.pitchMm * 1.25) {
    issues.push({
      code: "thread.length.short",
      severity: "warning",
      field: "lengthMm",
      message: "Thread length is short relative to pitch and may only form a partial turn."
    });
  }

  if ((spec.crestFlatPercent ?? 0) + (spec.rootFlatPercent ?? 0) >= 90) {
    issues.push({
      code: "thread.profile.over-flat",
      severity: "warning",
      field: "crestFlatPercent",
      message: "Crest and root flats consume most of the pitch and may collapse flank definition."
    });
  }

  if (spec.clearanceMode === "manual" && (spec.manualClearanceMm ?? 0) <= 0) {
    issues.push({
      code: "thread.clearance.invalid",
      severity: "error",
      field: "manualClearanceMm",
      message: "Manual clearance must be greater than zero."
    });
  }

  if (spec.starts > 1) {
    issues.push({
      code: "thread.starts.unsupported",
      severity: "warning",
      field: "starts",
      message: "Multi-start threads are not supported in the current MVP core flow."
    });
  }

  return issues;
}
