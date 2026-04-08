import type { SelectionType } from "../enums/index.js";
import type { Point3, Vector3 } from "../types/index.js";

export interface HostSelectionContext {
  selectionType: SelectionType;
  cylinderDiameterMm?: number;
  axisDirection?: Vector3;
  axisOrigin?: Point3;
  availableLengthMm?: number;
  isInternalCandidate?: boolean;
  isExternalCandidate?: boolean;
}
