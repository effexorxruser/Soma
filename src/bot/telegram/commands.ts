import type { Telegraf } from 'telegraf';

import type { AppConfig } from '../../config/env.js';
import type { AppOrchestrator } from '../../core/orchestrator.js';
import { isUserAllowed } from './gate.js';
import { ACCESS_DENIED_REPLY } from './messages.js';

const SUPPORTED_COMMANDS = ['/start', '/help', '/limits'] as const;

type SupportedCommand = (typeof SUPPORTED_COMMANDS)[number];

export function registerTelegramCommands(
  bot: Telegraf,
  config: AppConfig,
  orchestrator: AppOrchestrator,
): void {
  for (const command of SUPPORTED_COMMANDS) {
    bot.command(command.slice(1), async (ctx) => {
      const userId = ctx.from?.id;
      const allowed = isUserAllowed(userId, config.telegramAllowedUserIds, config.accessMode);

      if (!allowed) {
        await ctx.reply(ACCESS_DENIED_REPLY);
        return;
      }

      if (!userId) {
        await ctx.reply('Не удалось определить пользователя. Попробуйте позже.');
        return;
      }

      const result = await orchestrator.handleCommand(command, userId);
      await ctx.reply(result.text);
    });
  }
}

export function detectSupportedCommand(text: string): SupportedCommand | null {
  const commandToken = text.trim().split(/\s+/)[0]?.toLowerCase();

  if (!commandToken) {
    return null;
  }

  return SUPPORTED_COMMANDS.includes(commandToken as SupportedCommand)
    ? (commandToken as SupportedCommand)
    : null;
}
