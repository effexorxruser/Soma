import { Telegraf } from 'telegraf';

import type { AppConfig } from '../../config/env.js';
import type { AppOrchestrator } from '../../core/orchestrator.js';
import { registerTelegramRuntime } from './runtime.js';

export interface TelegramAdapter {
  bot: Telegraf;
  start: () => Promise<void>;
  stop: (reason?: string) => Promise<void>;
}

export function createTelegramAdapter(config: AppConfig, orchestrator: AppOrchestrator): TelegramAdapter {
  const bot = new Telegraf(config.telegramBotToken);

  registerTelegramRuntime(bot, config, orchestrator);

  return {
    bot,
    start: async () => {
      await bot.launch({ dropPendingUpdates: true });
    },
    stop: async (reason = 'shutdown') => {
      bot.stop(reason);
    },
  };
}
