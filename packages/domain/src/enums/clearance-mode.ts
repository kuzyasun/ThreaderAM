export const CLEARANCE_MODES = ["manual", "preset"] as const;

export type ClearanceMode = (typeof CLEARANCE_MODES)[number];
