import type {
  ClearanceMode,
  Handedness,
  ThreadDepthMode,
  ThreadOperationMode,
  ThreadProfileShape,
  ThreadStandard
} from "../enums/index.js";

export interface ThreadSpec {
  threadStandard?: ThreadStandard;
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
  depthMode?: ThreadDepthMode;
  manualDepthMm?: number;
  clearanceMode: ClearanceMode;
  manualClearanceMm?: number;
}
