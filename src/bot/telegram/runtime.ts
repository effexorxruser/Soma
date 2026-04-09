import type { Telegraf } from 'telegraf';

import type { AppConfig } from '../../config/env.js';
import type { AppOrchestrator } from '../../core/orchestrator.js';
import { detectSupportedCommand, registerTelegramCommands } from './commands.js';
import { ACCESS_DENIED_REPLY } from './messages.js';
import { isUserAllowed } from './gate.js';
import { normalizeTelegramTextContext } from './normalize.js';

export function registerTelegramRuntime(bot: Telegraf, config: AppConfig, orchestrator: AppOrchestrator): void {
  registerTelegramCommands(bot, config, orchestrator);

  bot.on('text', async (ctx) => {
    const userId = ctx.from?.id;
    const allowed = isUserAllowed(userId, config.telegramAllowedUserIds, config.accessMode);

    if (!allowed) {
      await ctx.reply(ACCESS_DENIED_REPLY);
      return;
    }

    const normalizedContext = normalizeTelegramTextContext(ctx);

    if (detectSupportedCommand(normalizedContext.text)) {
      return;
    }
    const result = await orchestrator.handleText(normalizedContext);

    await ctx.reply(result.text);
  });
}
