import type { AppEnv } from '../types/index.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type AccessMode = 'open' | 'allowlist';

export interface AppConfig {
  appEnv: AppEnv;
  telegramBotToken: string;
  telegramAllowedUserIds: number[];
  accessMode: AccessMode;
  freeDailyMessageLimit: number;
  databasePath: string;
  logLevel: LogLevel;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const appEnv = parseAppEnv(env.APP_ENV);
  const telegramBotToken = requireNonEmpty(env.TELEGRAM_BOT_TOKEN, 'TELEGRAM_BOT_TOKEN');
  const telegramAllowedUserIds = parseAllowedUserIds(env.TELEGRAM_ALLOWED_USER_IDS);
  const accessMode = parseAccessMode(env.ACCESS_MODE);
  const freeDailyMessageLimit = parsePositiveInt(env.FREE_DAILY_MESSAGE_LIMIT, 'FREE_DAILY_MESSAGE_LIMIT', 20);
  const databasePath = requireNonEmpty(env.DATABASE_PATH, 'DATABASE_PATH');
  const logLevel = parseLogLevel(env.LOG_LEVEL);

  return {
    appEnv,
    telegramBotToken,
    telegramAllowedUserIds,
    accessMode,
    freeDailyMessageLimit,
    databasePath,
    logLevel,
  };
}

function parseAppEnv(value: string | undefined): AppEnv {
  if (value === 'dev' || value === 'test' || value === 'prod') {
    return value;
  }

  return 'local';
}

function parseLogLevel(value: string | undefined): LogLevel {
  if (value === 'debug' || value === 'info' || value === 'warn' || value === 'error') {
    return value;
  }

  return 'info';
}

function parseAccessMode(value: string | undefined): AccessMode {
  if (!value || value.trim().length === 0) {
    return 'allowlist';
  }

  if (value === 'open' || value === 'allowlist') {
    return value;
  }

  throw new ConfigError('Некорректный ACCESS_MODE: ожидается open или allowlist.');
}

function requireNonEmpty(value: string | undefined, name: string): string {
  if (!value || value.trim().length === 0) {
    throw new ConfigError(`Отсутствует обязательная переменная окружения: ${name}.`);
  }

  return value.trim();
}

function parsePositiveInt(value: string | undefined, name: string, defaultValue: number): number {
  if (!value || value.trim().length === 0) {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new ConfigError(`Некорректный ${name}: ожидается положительное целое число.`);
  }

  return parsed;
}

export function parseAllowedUserIds(value: string | undefined): number[] {
  if (!value || value.trim().length === 0) {
    return [];
  }

  const ids = value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      const parsed = Number(item);

      if (!Number.isSafeInteger(parsed) || parsed < 1) {
        throw new ConfigError(
          'Некорректный TELEGRAM_ALLOWED_USER_IDS: ожидаются положительные целые ID через запятую.',
        );
      }

      return parsed;
    });

  return [...new Set(ids)];
}
