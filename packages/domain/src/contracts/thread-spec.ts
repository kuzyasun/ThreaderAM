import type {
  ClearanceMode,
  Handedness,
  ThreadOperationMode,
  ThreadProfileShape
} from "../enums/index.js";

export interface ThreadSpec {
  operationMode: ThreadOperationMode;
  profileShape: ThreadProfileShape;
  majorDiameterMm: number;
  pitchMm: number;
  lengthMm: number;
  handedness: Handedness;
  starts: number;
  crestFlatPercent?: number;
  rootFlatPercent?: number;
  flankAngleDeg?: number;
  clearanceMode: ClearanceMode;
  manualClearanceMm?: number;
}
