import 'dotenv/config';

import { loadConfig } from './config/env.js';
import { createAppRuntime } from './core/app.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const runtime = createAppRuntime(config);

  console.info(
    `[Soma] Старт в режиме ${config.appEnv}. Polling включен для локального baseline-пути.`,
  );

  if (config.telegramAllowedUserIds.length === 0) {
    console.info('[Soma] Allowlist не задан: бот отвечает всем входящим пользователям.');
  } else {
    console.info(
      `[Soma] Allowlist включен: разрешено пользователей — ${config.telegramAllowedUserIds.length}.`,
    );
  }

  await runtime.start();

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    console.info(`[Soma] Получен сигнал ${signal}, останавливаю polling...`);
    await runtime.stop();
    process.exit(0);
  };

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Неизвестная ошибка запуска.';
  console.error(`[Soma] Ошибка запуска: ${message}`);
  process.exit(1);
});
