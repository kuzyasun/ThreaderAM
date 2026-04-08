export const UI_TO_HOST_ACTIONS = [
  "host.getSelectionContext",
  "host.previewThread",
  "host.commitThread",
  "host.loadRecentConfig",
  "host.saveRecentConfig",
  "host.ping"
] as const;

export const HOST_TO_UI_ACTIONS = [
  "ui.selectionContextChanged",
  "ui.previewResult",
  "ui.commitResult",
  "ui.recentConfigLoaded",
  "ui.recentConfigSaved",
  "ui.hostError",
  "ui.hostReady"
] as const;

export const THREADKIT_ACTIONS = [
  ...UI_TO_HOST_ACTIONS,
  ...HOST_TO_UI_ACTIONS
] as const;

export type UiToHostAction = (typeof UI_TO_HOST_ACTIONS)[number];
export type HostToUiAction = (typeof HOST_TO_UI_ACTIONS)[number];
export type ThreadKitAction = (typeof THREADKIT_ACTIONS)[number];
