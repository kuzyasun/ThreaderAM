import type { ThreadSpec } from "@threadkit/domain";

export function defaultCrestFlatPercent(profileShape: ThreadSpec["profileShape"]): number {
  switch (profileShape) {
    case "triangular":
      return 8;
    case "trapezoidal":
      return 18;
    case "squareLike":
      return 24;
    default:
      return 18;
  }
}

export function defaultRootFlatPercent(profileShape: ThreadSpec["profileShape"]): number {
  switch (profileShape) {
    case "triangular":
      return 12;
    case "trapezoidal":
      return 22;
    case "squareLike":
      return 28;
    default:
      return 22;
  }
}

export function defaultFlankAngleDeg(profileShape: ThreadSpec["profileShape"]): number {
  switch (profileShape) {
    case "triangular":
      return 30;
    case "trapezoidal":
      return 30;
    case "squareLike":
      return 12;
    default:
      return 30;
  }
}

export function defaultManualClearanceMm(): number {
  return 0.18;
}
