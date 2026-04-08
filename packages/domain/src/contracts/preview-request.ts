import type { PreviewMode } from "../enums/index.js";
import type { HostSelectionContext } from "./host-selection-context.js";
import type { PrintSettings } from "./print-settings.js";
import type { ThreadSpec } from "./thread-spec.js";

export interface PreviewRequest {
  threadSpec: ThreadSpec;
  printSettings: PrintSettings;
  selectionContext?: HostSelectionContext;
  previewMode: PreviewMode;
}
