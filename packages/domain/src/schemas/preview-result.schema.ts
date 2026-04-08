import { z } from "zod";

import { point2Schema, point3Schema } from "./primitives.js";
import { recommendationSchema } from "./recommendation.schema.js";
import { validationIssueSchema } from "./validation-issue.schema.js";

export const profilePreview2dSchema = z
  .object({
    profilePoints: z.array(point2Schema),
    dimensionsMm: z
      .object({
        threadDepth: z.number().finite(),
        crestWidth: z.number().finite(),
        rootWidth: z.number().finite()
      })
      .strict()
      .optional()
  })
  .strict();

export const helixPreview3dSchema = z
  .object({
    pathPoints: z.array(point3Schema),
    turnCount: z.number().nonnegative().optional()
  })
  .strict();

export const layerSegment2dSchema = z
  .object({
    start: point2Schema,
    end: point2Schema
  })
  .strict();

export const layerSlicePreviewSchema = z
  .object({
    index: z.int().min(0),
    zMm: z.number().finite(),
    segments: z.array(layerSegment2dSchema)
  })
  .strict();

export const previewResultSchema = z
  .object({
    profile2d: profilePreview2dSchema.optional(),
    helix3d: helixPreview3dSchema.optional(),
    layerSlices: z.array(layerSlicePreviewSchema).optional(),
    issues: z.array(validationIssueSchema),
    recommendations: z.array(recommendationSchema),
    score: z.number().min(0).max(100).optional()
  })
  .strict();
