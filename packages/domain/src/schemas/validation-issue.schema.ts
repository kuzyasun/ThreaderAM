import { z } from "zod";

import { ISSUE_SEVERITIES } from "../enums/index.js";

export const validationIssueSchema = z
  .object({
    code: z.string().min(1),
    severity: z.enum(ISSUE_SEVERITIES),
    field: z.string().min(1).optional(),
    message: z.string().min(1)
  })
  .strict();
