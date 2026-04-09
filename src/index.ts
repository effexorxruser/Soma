import 'dotenv/config';

import { loadConfig } from './config/env.js';
import { createAppRuntime } from './core/app.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const runtime = createAppRuntime(config);

  console.info(`[Soma] Старт в режиме ${config.appEnv}. Polling включен для public beta kernel.`);
  console.info(
    `[Soma] Access mode: ${config.accessMode}. Free daily message limit: ${config.freeDailyMessageLimit}.`,
  );

  if (config.accessMode === 'allowlist') {
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
