export const MESSAGE_SOURCES = ["ui", "fusion-host"] as const;

export type MessageSource = (typeof MESSAGE_SOURCES)[number];
