import type { Context } from 'telegraf';

import type { NormalizedInputContext } from '../../services/safety/types.js';

export function normalizeTelegramTextContext(ctx: Context): NormalizedInputContext {
  const text = 'text' in ctx.message ? ctx.message.text : '';

  return {
    source: 'telegram',
    messageKind: 'text',
    text,
    userId: ctx.from?.id ?? null,
    username: ctx.from?.username,
    receivedAt: new Date(),
  };
}
