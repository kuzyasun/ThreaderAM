export const THREAD_PROFILE_SHAPES = [
  "triangular",
  "trapezoidal",
  "squareLike"
] as const;

export type ThreadProfileShape = (typeof THREAD_PROFILE_SHAPES)[number];
