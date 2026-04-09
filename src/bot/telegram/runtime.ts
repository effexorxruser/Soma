import type { Telegraf } from 'telegraf';

import type { AppConfig } from '../../config/env.js';
import { ACCESS_DENIED_REPLY, SAFE_PLACEHOLDER_REPLY } from './messages.js';
import { isUserAllowed } from './gate.js';

export function registerTelegramRuntime(bot: Telegraf, config: AppConfig): void {
  bot.on('text', async (ctx) => {
    const userId = ctx.from?.id;
    const allowed = isUserAllowed(userId, config.telegramAllowedUserIds);

    if (!allowed) {
      await ctx.reply(ACCESS_DENIED_REPLY);
      return;
    }

    await ctx.reply(SAFE_PLACEHOLDER_REPLY);
  });
}
