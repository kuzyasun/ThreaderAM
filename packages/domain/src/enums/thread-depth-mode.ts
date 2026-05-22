export const THREAD_DEPTH_MODES = ["auto", "manual"] as const;

export type ThreadDepthMode = (typeof THREAD_DEPTH_MODES)[number];
