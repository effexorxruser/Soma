import { describe, expect, it } from 'vitest';

import { ConfigError, loadConfig, parseAllowedUserIds } from '../../src/config/env.js';

describe('config/env', () => {
  it('парсит allowlist из строки через запятую', () => {
    expect(parseAllowedUserIds('1, 2,3')).toEqual([1, 2, 3]);
  });

  it('удаляет дубликаты в allowlist', () => {
    expect(parseAllowedUserIds('7,7,8')).toEqual([7, 8]);
  });

  it('бросает ошибку при некорректном ID в allowlist', () => {
    expect(() => parseAllowedUserIds('abc')).toThrow(ConfigError);
  });

  it('бросает ошибку если отсутствует TELEGRAM_BOT_TOKEN', () => {
    expect(() =>
      loadConfig({
        APP_ENV: 'local',
        TELEGRAM_BOT_TOKEN: '',
        TELEGRAM_ALLOWED_USER_IDS: '',
        ACCESS_MODE: 'allowlist',
        FREE_DAILY_MESSAGE_LIMIT: '20',
        DATABASE_PATH: ':memory:',
        LOG_LEVEL: 'info',
      }),
    ).toThrow('Отсутствует обязательная переменная окружения: TELEGRAM_BOT_TOKEN.');
  });

  it('парсит public beta kernel env', () => {
    const config = loadConfig({
      APP_ENV: 'test',
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_ALLOWED_USER_IDS: '1,2',
      ACCESS_MODE: 'allowlist',
      FREE_DAILY_MESSAGE_LIMIT: '5',
      DATABASE_PATH: ':memory:',
      LOG_LEVEL: 'debug',
    });

    expect(config.accessMode).toBe('allowlist');
    expect(config.freeDailyMessageLimit).toBe(5);
    expect(config.databasePath).toBe(':memory:');
  });
});
