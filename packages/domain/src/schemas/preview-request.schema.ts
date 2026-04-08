import { z } from "zod";

import { PREVIEW_MODES } from "../enums/index.js";
import { hostSelectionContextSchema } from "./host-selection-context.schema.js";
import { printSettingsSchema } from "./print-settings.schema.js";
import { threadSpecSchema } from "./thread-spec.schema.js";

export const previewRequestSchema = z
  .object({
    threadSpec: threadSpecSchema,
    printSettings: printSettingsSchema,
    selectionContext: hostSelectionContextSchema.optional(),
    previewMode: z.enum(PREVIEW_MODES)
  })
  .strict();
