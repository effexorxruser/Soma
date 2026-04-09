import { renderStructuredReply } from './render.js';
import type { ConversationRequest, ConversationResponse } from './types.js';

export interface ConversationService {
  reply: (request: ConversationRequest) => ConversationResponse;
}

export function createConversationService(): ConversationService {
  return {
    reply: (request) => ({
      text: renderStructuredReply(request.text),
    }),
  };
}
