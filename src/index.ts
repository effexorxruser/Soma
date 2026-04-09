import { createAppContext } from './core/app.js';

function main(): void {
  const context = createAppContext(process.env.APP_ENV);

  console.info(
    `[Soma baseline] Режим: ${context.environment}. ` +
      'Текущая сборка содержит только базовую структуру репозитория.',
  );
}

main();
