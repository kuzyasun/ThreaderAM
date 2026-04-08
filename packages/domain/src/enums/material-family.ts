export const MATERIAL_FAMILIES = ["PLA", "PETG", "ABS_ASA", "PA_CF", "TPU"] as const;

export type MaterialFamily = (typeof MATERIAL_FAMILIES)[number];
