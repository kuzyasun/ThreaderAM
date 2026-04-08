import { describe, expect, it } from "vitest";
import type { PrintSettings, ThreadSpec } from "@threadkit/domain";

import {
  buildThreadProfile,
  estimateFdmClearance,
  normalizeThreadSpec,
  sampleHelixPath
} from "../src/index.js";
import { loadFixture } from "./helpers/load-fixture.js";

describe("core geometry", () => {
  const threadSpec = loadFixture<ThreadSpec>("fixtures/thread-specs/external-m40-balanced.json");
  const printSettings = loadFixture<PrintSettings>("fixtures/print-settings/nozzle-04-layer-02-petg.json");

  it("normalizes thread defaults for the balanced fixture", () => {
    const normalized = normalizeThreadSpec(threadSpec);

    expect(normalized.crestFlatPercent).toBe(18);
    expect(normalized.rootFlatPercent).toBe(22);
    expect(normalized.flankAngleDeg).toBe(30);
    expect(normalized.manualClearanceMm).toBeUndefined();
  });

  it("builds a stable thread profile", () => {
    const result = buildThreadProfile(threadSpec);

    expect(result.profilePoints).toHaveLength(6);
    expect(result.metrics.threadDepthMm).toBeCloseTo(1.56, 2);
    expect(result.metrics.crestWidthMm).toBeCloseTo(0.54, 2);
    expect(result.metrics.rootWidthMm).toBeCloseTo(0.66, 2);
  });

  it("samples a helix path across the requested length", () => {
    const points = sampleHelixPath({
      radiusMm: threadSpec.majorDiameterMm / 2,
      pitchMm: threadSpec.pitchMm,
      lengthMm: threadSpec.lengthMm,
      handedness: threadSpec.handedness
    });

    expect(points[0]).toEqual({ x: 20, y: 0, z: 0 });
    expect(points.at(-1)?.z).toBe(22);
    expect(points.length).toBeGreaterThan(40);
  });

  it("estimates positive PETG clearance", () => {
    const estimate = estimateFdmClearance({ spec: threadSpec, printSettings });

    expect(estimate.recommendedClearanceMm).toBeCloseTo(0.192, 3);
    expect(estimate.rationale).toHaveLength(2);
  });
});
