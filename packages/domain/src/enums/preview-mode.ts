export const PREVIEW_MODES = ["profile", "helix", "layer"] as const;

export type PreviewMode = (typeof PREVIEW_MODES)[number];
