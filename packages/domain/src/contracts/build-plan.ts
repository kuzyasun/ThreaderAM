import type { BooleanIntent } from "../enums/index.js";
import type { Point2, Point3 } from "../types/index.js";
import type { Recommendation } from "./recommendation.js";
import type { ThreadSpec } from "./thread-spec.js";
import type { ValidationIssue } from "./validation-issue.js";

export interface BuildPlan {
  normalizedSpec: ThreadSpec;
  booleanIntent: BooleanIntent;
  pathPoints: Point3[];
  profilePoints: Point2[];
  issues: ValidationIssue[];
  recommendations: Recommendation[];
}
