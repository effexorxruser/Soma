import type { Telegraf } from 'telegraf';

import type { AppConfig } from '../../config/env.js';
import { evaluateSafetyPolicy } from '../../services/safety/policy.js';
import { ACCESS_DENIED_REPLY } from './messages.js';
import { isUserAllowed } from './gate.js';

export function registerTelegramRuntime(bot: Telegraf, config: AppConfig): void {
  bot.on('text', async (ctx) => {
    const userId = ctx.from?.id;
    const allowed = isUserAllowed(userId, config.telegramAllowedUserIds);

    if (!allowed) {
      await ctx.reply(ACCESS_DENIED_REPLY);
      return;
    }

    const decision = evaluateSafetyPolicy({ text: ctx.message.text });
    await ctx.reply(decision.responseText);
  });
}
