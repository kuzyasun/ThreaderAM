import { z } from "zod";

import { RECOMMENDATION_PRIORITIES } from "../enums/index.js";

export const recommendationSchema = z
  .object({
    code: z.string().min(1),
    title: z.string().min(1),
    details: z.string().min(1),
    priority: z.enum(RECOMMENDATION_PRIORITIES)
  })
  .strict();
