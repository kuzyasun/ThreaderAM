import { z } from "zod";

import { MESSAGE_SOURCES } from "../enums/index.js";
import { THREADKIT_ACTIONS } from "../messaging/actions.js";

export const messageEnvelopeSchema = z
  .object({
    requestId: z.string().min(1),
    action: z.enum(THREADKIT_ACTIONS),
    source: z.enum(MESSAGE_SOURCES),
    payload: z.unknown()
  })
  .strict();

export function createMessageEnvelopeSchema<TPayload extends z.ZodType>(payloadSchema: TPayload) {
  return z
    .object({
      requestId: z.string().min(1),
      action: z.enum(THREADKIT_ACTIONS),
      source: z.enum(MESSAGE_SOURCES),
      payload: payloadSchema
    })
    .strict();
}
