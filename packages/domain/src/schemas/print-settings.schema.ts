import { z } from "zod";

import { MATERIAL_FAMILIES, QUALITY_PRESETS } from "../enums/index.js";

export const printSettingsSchema = z
  .object({
    materialFamily: z.enum(MATERIAL_FAMILIES),
    nozzleDiameterMm: z.number().positive(),
    layerHeightMm: z.number().positive(),
    lineWidthMm: z.number().positive().optional(),
    qualityPreset: z.enum(QUALITY_PRESETS).optional()
  })
  .strict();
