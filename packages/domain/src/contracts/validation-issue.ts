import type { IssueSeverity } from "../enums/index.js";

export interface ValidationIssue {
  code: string;
  severity: IssueSeverity;
  field?: string;
  message: string;
}
