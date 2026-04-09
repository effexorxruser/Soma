import type { AppContext, AppEnv } from '../types/index.js';

export function createAppContext(envValue: string | undefined): AppContext {
  const normalizedEnv = normalizeEnv(envValue);

  return {
    appName: 'Soma',
    environment: normalizedEnv,
    startedAt: new Date(),
  };
}

function normalizeEnv(value: string | undefined): AppEnv {
  if (value === 'dev' || value === 'test' || value === 'prod') {
    return value;
  }

  return 'local';
}
