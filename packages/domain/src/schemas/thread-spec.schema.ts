import { z } from "zod";

import {
  CLEARANCE_MODES,
  HANDEDNESS_VALUES,
  THREAD_OPERATION_MODES,
  THREAD_PROFILE_SHAPES
} from "../enums/index.js";

export const threadSpecSchema = z
  .object({
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
  });
