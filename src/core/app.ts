import type { AppConfig } from '../config/env.js';
import { createTelegramAdapter } from '../bot/telegram/adapter.js';

export interface AppRuntime {
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export function createAppRuntime(config: AppConfig): AppRuntime {
  const telegramAdapter = createTelegramAdapter(config);

  return {
    start: async () => {
      await telegramAdapter.start();
    },
    stop: async () => {
      await telegramAdapter.stop();
    },
  };
}
