export const THREAD_STANDARDS = [
  "custom",
  "isoMetric",
  "trapezoidalMetric",
  "acmeImperial"
] as const;

export type ThreadStandard = (typeof THREAD_STANDARDS)[number];
