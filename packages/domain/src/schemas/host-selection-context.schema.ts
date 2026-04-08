import { z } from "zod";

import { SELECTION_TYPES } from "../enums/index.js";
import { point3Schema, vector3Schema } from "./primitives.js";

export const hostSelectionContextSchema = z
  .object({
    selectionType: z.enum(SELECTION_TYPES),
    cylinderDiameterMm: z.number().positive().optional(),
    axisDirection: vector3Schema.optional(),
    axisOrigin: point3Schema.optional(),
    availableLengthMm: z.number().positive().optional(),
    isInternalCandidate: z.boolean().optional(),
    isExternalCandidate: z.boolean().optional()
  })
  .strict();
