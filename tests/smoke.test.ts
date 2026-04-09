import { describe, expect, it } from 'vitest';

import { loadConfig } from '../src/config/env.js';

describe('startup smoke', () => {
  it('загружает минимальную конфигурацию для baseline runtime', () => {
    const config = loadConfig({
      APP_ENV: 'local',
      TELEGRAM_BOT_TOKEN: 'test-token',
      TELEGRAM_ALLOWED_USER_IDS: '',
      LOG_LEVEL: 'info',
    });

    expect(config.appEnv).toBe('local');
    expect(config.telegramBotToken).toBe('test-token');
    expect(config.telegramAllowedUserIds).toEqual([]);
  });
});
