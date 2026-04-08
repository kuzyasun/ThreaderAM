import { computed, inject, Injectable, signal } from "@angular/core";
import { buildPreviewBundle } from "@threadkit/core-engine";
import type {
  HostSelectionContext,
  PreviewMode,
  PrintSettings,
  ThreadSpec
} from "@threadkit/domain";

import { BridgeService, type ThreadkitConfigSnapshot } from "./bridge.service";

@Injectable({
  providedIn: "root"
})
export class MockThreadkitStateService {
  private readonly bridge = inject(BridgeService);

  readonly selectionContext = signal<HostSelectionContext>({
    selectionType: "cylindricalFace",
    cylinderDiameterMm: 40,
    availableLengthMm: 32,
    isExternalCandidate: true,
    isInternalCandidate: false,
    axisDirection: { x: 0, y: 0, z: 1 },
    axisOrigin: { x: 0, y: 0, z: 0 }
  });

  readonly threadSpec = signal<ThreadSpec>({
    operationMode: "external",
    profileShape: "trapezoidal",
    majorDiameterMm: 40,
    pitchMm: 3,
    lengthMm: 22,
    handedness: "right",
    starts: 1,
    crestFlatPercent: 18,
    rootFlatPercent: 22,
    flankAngleDeg: 30,
    clearanceMode: "preset"
  });

  readonly printSettings = signal<PrintSettings>({
    materialFamily: "PETG",
    nozzleDiameterMm: 0.4,
    layerHeightMm: 0.2,
    lineWidthMm: 0.45,
    qualityPreset: "balanced"
  });

  readonly previewMode = signal<PreviewMode>("profile");

  readonly previewResult = computed(() =>
    buildPreviewBundle({
      spec: this.threadSpec(),
      printSettings: this.printSettings(),
      selectionContext: this.selectionContext()
    })
  );

  readonly summary = computed(() => ({
    issueCount: this.previewResult().issues.length,
    recommendationCount: this.previewResult().recommendations.length,
    score: this.previewResult().score ?? 0
  }));

  readonly hostStatus = this.bridge.hostStatus;
  readonly lastBridgeError = this.bridge.lastError;
  readonly recentConfigMeta = this.bridge.recentConfigMeta;

  updateThreadSpec(patch: Partial<ThreadSpec>): void {
    this.threadSpec.update((current) => ({ ...current, ...patch }));
  }

  updatePrintSettings(patch: Partial<PrintSettings>): void {
    this.printSettings.update((current) => ({ ...current, ...patch }));
  }

  setPreviewMode(mode: PreviewMode): void {
    this.previewMode.set(mode);
  }

  async initializeBridge(): Promise<void> {
    await this.bridge.pingHost();
    await this.bridge.loadRecentConfig();
  }

  async loadRecentConfig(): Promise<void> {
    const payload = await this.bridge.loadRecentConfig();
    if (payload.config) {
      this.applySnapshot(payload.config);
    }
  }

  async saveRecentConfig(): Promise<void> {
    await this.bridge.saveRecentConfig(this.createSnapshot());
  }

  private createSnapshot(): ThreadkitConfigSnapshot {
    return {
      threadSpec: this.threadSpec(),
      printSettings: this.printSettings(),
      previewMode: this.previewMode(),
      selectionContext: this.selectionContext()
    };
  }

  private applySnapshot(snapshot: ThreadkitConfigSnapshot): void {
    this.threadSpec.set(snapshot.threadSpec);
    this.printSettings.set(snapshot.printSettings);
    this.previewMode.set(snapshot.previewMode);
    if (snapshot.selectionContext) {
      this.selectionContext.set(snapshot.selectionContext);
    }
  }
}
