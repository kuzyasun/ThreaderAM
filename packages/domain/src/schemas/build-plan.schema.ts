import { z } from "zod";

import { BOOLEAN_INTENTS } from "../enums/index.js";
import { point2Schema, point3Schema } from "./primitives.js";
import { recommendationSchema } from "./recommendation.schema.js";
import { threadSpecSchema } from "./thread-spec.schema.js";
import { validationIssueSchema } from "./validation-issue.schema.js";

export const buildPlanSchema = z
  .object({
    normalizedSpec: threadSpecSchema,
    booleanIntent: z.enum(BOOLEAN_INTENTS),
    pathPoints: z.array(point3Schema),
    profilePoints: z.array(point2Schema),
    issues: z.array(validationIssueSchema),
    recommendations: z.array(recommendationSchema)
  })
  .strict();
