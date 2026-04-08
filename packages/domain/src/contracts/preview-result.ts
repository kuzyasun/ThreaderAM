import type { Point2, Point3 } from "../types/index.js";
import type { Recommendation } from "./recommendation.js";
import type { ValidationIssue } from "./validation-issue.js";

export interface ProfilePreview2d {
  profilePoints: Point2[];
  dimensionsMm?: {
    threadDepth: number;
    crestWidth: number;
    rootWidth: number;
  };
}

export interface HelixPreview3d {
  pathPoints: Point3[];
  turnCount?: number;
}

export interface LayerSegment2d {
  start: Point2;
  end: Point2;
}

export interface LayerSlicePreview {
  index: number;
  zMm: number;
  segments: LayerSegment2d[];
}

export interface PreviewResult {
  profile2d?: ProfilePreview2d;
  helix3d?: HelixPreview3d;
  layerSlices?: LayerSlicePreview[];
  issues: ValidationIssue[];
  recommendations: Recommendation[];
  score?: number;
}
