export const QUALITY_PRESETS = ["fine", "balanced", "strong"] as const;

export type QualityPreset = (typeof QUALITY_PRESETS)[number];
