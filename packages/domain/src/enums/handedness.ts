export const HANDEDNESS_VALUES = ["right", "left"] as const;

export type Handedness = (typeof HANDEDNESS_VALUES)[number];
