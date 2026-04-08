import type { MessageSource } from "../enums/index.js";
import type { ThreadKitAction } from "../messaging/actions.js";

export interface MessageEnvelope<
  TPayload = unknown,
  TAction extends ThreadKitAction = ThreadKitAction
> {
  requestId: string;
  action: TAction;
  source: MessageSource;
  payload: TPayload;
}
