import { describe, expect, it } from "vitest";
import type {
  HostSelectionContext,
  PreviewResult,
  PrintSettings,
  ThreadSpec
} from "@threadkit/domain";

import { buildPreviewBundle } from "../src/index.js";
import { loadFixture } from "./helpers/load-fixture.js";

describe("preview bundle", () => {
  const threadSpec = loadFixture<ThreadSpec>("fixtures/thread-specs/external-m40-balanced.json");
  const printSettings = loadFixture<PrintSettings>("fixtures/print-settings/nozzle-04-layer-02-petg.json");
  const selectionContext = loadFixture<HostSelectionContext>(
    "fixtures/selection-context/simple-cylinder-face.json"
  );
  const golden = loadFixture<{
    profileDimensionsMm: { threadDepth: number; crestWidth: number; rootWidth: number };
    helixTurnCount: number;
    layerSliceCount: number;
    score: number;
    issueCodes: string[];
    recommendationCodes: string[];
  }>("golden/preview-results/external-m40-balanced-summary.json");

  it("builds profile, helix, and layer previews from shared fixtures", () => {
    const preview = buildPreviewBundle({
      spec: threadSpec,
      printSettings,
      selectionContext
    });

    assertPreviewStructure(preview);
    expect(preview.profile2d?.dimensionsMm).toEqual(golden.profileDimensionsMm);
    expect(preview.helix3d?.turnCount).toBe(golden.helixTurnCount);
    expect(preview.layerSlices).toHaveLength(golden.layerSliceCount);
    expect(preview.score).toBe(golden.score);
    expect(preview.issues.map((issue) => issue.code)).toEqual(golden.issueCodes);
    expect(preview.recommendations.map((item) => item.code)).toEqual(
      golden.recommendationCodes
    );
  });
});

function assertPreviewStructure(preview: PreviewResult): void {
  expect(preview.profile2d?.profilePoints.length).toBeGreaterThan(0);
  expect(preview.helix3d?.pathPoints.length).toBeGreaterThan(0);
  expect(preview.layerSlices?.length).toBeGreaterThan(0);
}
