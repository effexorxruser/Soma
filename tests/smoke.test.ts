import { describe, expect, it } from 'vitest';

import { loadConfig } from '../src/config/env.js';

describe('startup smoke', () => {
  it('загружает минимальную конфигурацию для public beta kernel runtime', () => {
    const config = loadConfig({
      APP_ENV: 'local',
      TELEGRAM_BOT_TOKEN: 'test-token',
      TELEGRAM_ALLOWED_USER_IDS: '',
      ACCESS_MODE: 'open',
      FREE_DAILY_MESSAGE_LIMIT: '10',
      DATABASE_PATH: ':memory:',
      LOG_LEVEL: 'info',
    });

    expect(config.appEnv).toBe('local');
    expect(config.telegramBotToken).toBe('test-token');
    expect(config.telegramAllowedUserIds).toEqual([]);
    expect(config.accessMode).toBe('open');
  });
});
