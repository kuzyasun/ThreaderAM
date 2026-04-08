import type { HostSelectionContext, PreviewResult, PrintSettings, ThreadSpec } from "@threadkit/domain";

import { buildHelixPreview } from "./build-helix-preview.js";
import { buildLayerPreview } from "./build-layer-preview.js";
import { buildProfilePreview } from "./build-profile-preview.js";

export function buildPreviewBundle(args: {
  spec: ThreadSpec;
  printSettings: PrintSettings;
  selectionContext?: HostSelectionContext;
}): PreviewResult {
  const profile = buildProfilePreview(args);
  const helix = buildHelixPreview(args);
  const layer = buildLayerPreview(args);

  return {
    profile2d: profile.profile2d,
    helix3d: helix.helix3d,
    layerSlices: layer.layerSlices,
    issues: layer.issues,
    recommendations: layer.recommendations,
    score: layer.score
  };
}
