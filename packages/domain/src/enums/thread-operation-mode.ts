export const THREAD_OPERATION_MODES = ["external", "internal"] as const;

export type ThreadOperationMode = (typeof THREAD_OPERATION_MODES)[number];
