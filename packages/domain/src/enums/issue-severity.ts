export const ISSUE_SEVERITIES = ["info", "warning", "error"] as const;

export type IssueSeverity = (typeof ISSUE_SEVERITIES)[number];
