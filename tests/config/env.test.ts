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
        LOG_LEVEL: 'info',
      }),
    ).toThrow('Отсутствует обязательная переменная окружения: TELEGRAM_BOT_TOKEN.');
  });
});
