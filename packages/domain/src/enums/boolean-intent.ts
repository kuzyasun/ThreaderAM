export const BOOLEAN_INTENTS = ["join", "cut"] as const;

export type BooleanIntent = (typeof BOOLEAN_INTENTS)[number];
