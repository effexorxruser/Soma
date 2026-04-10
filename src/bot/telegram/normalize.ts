import type { Context } from 'telegraf';

import type { NormalizedInputContext } from '../../services/safety/types.js';

export function normalizeTelegramTextContext(ctx: Context): NormalizedInputContext {
  const message = ctx.message;
  const text = message && 'text' in message ? message.text : '';

  return {
    source: 'telegram',
    messageKind: 'text',
    text,
    userId: ctx.from?.id ?? null,
    username: ctx.from?.username,
    receivedAt: new Date(),
  };
}
