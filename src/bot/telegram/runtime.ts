import type { Telegraf } from 'telegraf';

import type { AppConfig } from '../../config/env.js';
import { createPolicyFirstContract } from '../../services/safety/contract.js';
import { ACCESS_DENIED_REPLY } from './messages.js';
import { isUserAllowed } from './gate.js';
import { normalizeTelegramTextContext } from './normalize.js';

const policyContract = createPolicyFirstContract();

export function registerTelegramRuntime(bot: Telegraf, config: AppConfig): void {
  bot.on('text', async (ctx) => {
    const userId = ctx.from?.id;
    const allowed = isUserAllowed(userId, config.telegramAllowedUserIds);

    if (!allowed) {
      await ctx.reply(ACCESS_DENIED_REPLY);
      return;
    }

    const normalizedContext = normalizeTelegramTextContext(ctx);
    const decision = policyContract.evaluate(normalizedContext);

    await ctx.reply(decision.response.text);
  });
}
