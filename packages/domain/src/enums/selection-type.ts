export const SELECTION_TYPES = ["cylindricalFace", "axis", "body"] as const;

export type SelectionType = (typeof SELECTION_TYPES)[number];
