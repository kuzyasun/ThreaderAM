import type { MaterialFamily, QualityPreset } from "../enums/index.js";

export interface PrintSettings {
  materialFamily: MaterialFamily;
  nozzleDiameterMm: number;
  layerHeightMm: number;
  lineWidthMm?: number;
  qualityPreset?: QualityPreset;
}
