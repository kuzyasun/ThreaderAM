import { Injectable, signal } from "@angular/core";
import type {
  HostSelectionContext,
  PreviewMode,
  PrintSettings,
  ThreadSpec
} from "@threadkit/domain";

export interface ThreadkitConfigSnapshot {
  threadSpec: ThreadSpec;
  printSettings: PrintSettings;
  previewMode: PreviewMode;
  selectionContext?: HostSelectionContext;
}

export interface HostReadyPayload {
  host: string;
  status: string;
  paletteVisible?: boolean;
}

export interface RecentConfigLoadedPayload {
  hasConfig: boolean;
  savedAt?: string | null;
  config?: ThreadkitConfigSnapshot | null;
}

export interface RecentConfigSavedPayload {
  hasConfig: boolean;
  savedAt?: string | null;
}

export interface HostErrorPayload {
  code: string;
  message: string;
}

interface BridgeResponseMap {
  "ui.hostReady": HostReadyPayload;
  "ui.recentConfigLoaded": RecentConfigLoadedPayload;
  "ui.recentConfigSaved": RecentConfigSavedPayload;
  "ui.hostError": HostErrorPayload;
}

interface ThreadkitHostBridge {
  send(message: string): Promise<string> | string;
}

type SupportedResponseAction = keyof BridgeResponseMap;
type BridgeRequestAction = "host.ping" | "host.loadRecentConfig" | "host.saveRecentConfig";

const RECENT_CONFIG_STORAGE_KEY = "threadkit.recentConfig";

interface BridgeEnvelope<TPayload, TAction extends string> {
  requestId: string;
  action: TAction;
  source: string;
  payload: TPayload;
}

declare global {
  interface Window {
    threadkitHostBridge?: ThreadkitHostBridge;
  }
}

@Injectable({
  providedIn: "root"
})
export class BridgeService {
  readonly hostStatus = signal<HostReadyPayload | null>(null);
  readonly lastError = signal<HostErrorPayload | null>(null);
  readonly recentConfigMeta = signal<{ hasConfig: boolean; savedAt?: string | null }>({
    hasConfig: false,
    savedAt: null
  });

  async pingHost(): Promise<HostReadyPayload> {
    const response = await this.send<"ui.hostReady">("host.ping", {});
    this.hostStatus.set(response.payload);
    return response.payload;
  }

  async loadRecentConfig(): Promise<RecentConfigLoadedPayload> {
    const response = await this.send<"ui.recentConfigLoaded">("host.loadRecentConfig", {});
    this.recentConfigMeta.set({
      hasConfig: response.payload.hasConfig,
      savedAt: response.payload.savedAt ?? null
    });
    return response.payload;
  }

  async saveRecentConfig(config: ThreadkitConfigSnapshot): Promise<RecentConfigSavedPayload> {
    const response = await this.send<"ui.recentConfigSaved">("host.saveRecentConfig", config);
    this.recentConfigMeta.set({
      hasConfig: response.payload.hasConfig,
      savedAt: response.payload.savedAt ?? null
    });
    return response.payload;
  }

  private async send<TResponseAction extends SupportedResponseAction>(
    action: BridgeRequestAction,
    payload: unknown
  ): Promise<BridgeEnvelope<BridgeResponseMap[TResponseAction], TResponseAction>> {
    const envelope: BridgeEnvelope<unknown, BridgeRequestAction> = {
      requestId: createRequestId(action),
      action,
      source: "ui",
      payload
    };

    const rawResponse = await this.sendThroughBridge(envelope);
    const parsed = JSON.parse(rawResponse) as BridgeEnvelope<unknown, SupportedResponseAction>;

    if (parsed.action === "ui.hostError") {
      const hostError = parsed.payload as HostErrorPayload;
      this.lastError.set(hostError);
      throw new Error(`${hostError.code}: ${hostError.message}`);
    }

    this.lastError.set(null);
    return parsed as BridgeEnvelope<BridgeResponseMap[TResponseAction], TResponseAction>;
  }

  private async sendThroughBridge(
    envelope: BridgeEnvelope<unknown, BridgeRequestAction>
  ): Promise<string> {
    const bridge = getHostBridge();
    if (bridge) {
      const response = bridge.send(JSON.stringify(envelope));
      return typeof response === "string" ? response : await response;
    }

    return simulateBridgeResponse(envelope);
  }
}

function getHostBridge(): ThreadkitHostBridge | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.threadkitHostBridge ?? null;
}

function simulateBridgeResponse(envelope: BridgeEnvelope<unknown, BridgeRequestAction>): string {
  switch (envelope.action) {
    case "host.ping":
      return JSON.stringify(
        createEnvelope("ui.hostReady", envelope.requestId, {
          host: "ui-dev-fallback",
          status: "ready",
          paletteVisible: true
        })
      );

    case "host.loadRecentConfig": {
      const stored = readRecentConfigFromStorage();
      return JSON.stringify(
        createEnvelope("ui.recentConfigLoaded", envelope.requestId, {
          hasConfig: stored !== null,
          savedAt: stored?.savedAt ?? null,
          config: stored?.config ?? null
        })
      );
    }

    case "host.saveRecentConfig": {
      const saved = writeRecentConfigToStorage(envelope.payload as ThreadkitConfigSnapshot);
      return JSON.stringify(
        createEnvelope("ui.recentConfigSaved", envelope.requestId, {
          hasConfig: true,
          savedAt: saved.savedAt
        })
      );
    }

    default:
      return JSON.stringify(
        createEnvelope("ui.hostError", envelope.requestId, {
          code: "ui.bridge.unsupportedAction",
          message: `No browser fallback is implemented for action ${envelope.action}.`
        })
      );
  }
}

function readRecentConfigFromStorage():
  | { savedAt: string; config: ThreadkitConfigSnapshot }
  | null {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(RECENT_CONFIG_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as { savedAt: string; config: ThreadkitConfigSnapshot };
  } catch {
    return null;
  }
}

function writeRecentConfigToStorage(config: ThreadkitConfigSnapshot): { savedAt: string } {
  const savedAt = new Date().toISOString();
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(
      RECENT_CONFIG_STORAGE_KEY,
      JSON.stringify({
        savedAt,
        config
      })
    );
  }

  return { savedAt };
}

function createEnvelope<TPayload, TAction extends SupportedResponseAction>(
  action: TAction,
  requestId: string,
  payload: TPayload
): BridgeEnvelope<TPayload, TAction> {
  return {
    requestId,
    action,
    source: "fusion-host",
    payload
  };
}

function createRequestId(action: string): string {
  return `${action}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
