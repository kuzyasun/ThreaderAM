import { z } from "zod";

import {
  CLEARANCE_MODES,
  HANDEDNESS_VALUES,
  THREAD_DEPTH_MODES,
  THREAD_OPERATION_MODES,
  THREAD_PROFILE_SHAPES,
  THREAD_STANDARDS
} from "../enums/index.js";

export const threadSpecSchema = z
  .object({
    threadStandard: z.enum(THREAD_STANDARDS).optional(),
    operationMode: z.enum(THREAD_OPERATION_MODES),
    profileShape: z.enum(THREAD_PROFILE_SHAPES),
    majorDiameterMm: z.number().positive(),
    pitchMm: z.number().positive(),
    lengthMm: z.number().positive(),
    handedness: z.enum(HANDEDNESS_VALUES),
    starts: z.int().min(1),
    crestFlatPercent: z.number().min(0).max(100).optional(),
    rootFlatPercent: z.number().min(0).max(100).optional(),
    flankAngleDeg: z.number().positive().max(90).optional(),
    depthMode: z.enum(THREAD_DEPTH_MODES).optional(),
    manualDepthMm: z.number().positive().optional(),
    clearanceMode: z.enum(CLEARANCE_MODES),
    manualClearanceMm: z.number().min(0).optional()
  })
  .strict()
  .superRefine((value, context) => {
    if (value.clearanceMode === "manual" && value.manualClearanceMm === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manualClearanceMm"],
        message: "manualClearanceMm is required when clearanceMode is manual."
      });
    }

    if (
      (value.threadStandard ?? "custom") === "custom" &&
      (value.depthMode ?? "auto") === "manual" &&
      value.manualDepthMm === undefined
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manualDepthMm"],
        message: "manualDepthMm is required when threadStandard is custom and depthMode is manual."
      });
    }
  });
