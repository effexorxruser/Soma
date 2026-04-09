# Разработка Soma (transport/config + safety baseline)

## Установка зависимостей

```bash
npm install
```

## Локальный запуск

1. Создайте `.env` из шаблона:

```bash
cp .env.example .env
```

2. Заполните обязательные/опциональные переменные:

- `APP_ENV` — режим (`local` по умолчанию).
- `TELEGRAM_BOT_TOKEN` — **обязательно** для запуска polling runtime.
- `TELEGRAM_ALLOWED_USER_IDS` — опциональный список Telegram user id через запятую.
- `LOG_LEVEL` — базовый уровень логирования (`info` по умолчанию).

3. Запустите dev-режим:

```bash
npm run dev
```

## Команды

```bash
npm run build  # компиляция TypeScript в dist/
npm run start  # запуск собранного runtime
npm run test   # unit/smoke тесты
npm run lint   # ESLint
npm run format # Prettier
```

## Где находятся safety boundaries

- Правила классификации: `src/services/safety/classifier.ts`
- Policy evaluation: `src/services/safety/policy.ts`
- Пользовательские fallback-тексты: `src/services/safety/messages.ts`

## Как тестировать policy behavior

- Запустите `npm run test`.
- Проверки policy находятся в `tests/services/safety/policy.test.ts`.
- Проверки allowlist отдельно в `tests/bot/allowlist.test.ts`.

## Правило расширения

Новые пользовательские тексты и новые response-path не должны обходить safety/policy слой.
Transport (`src/bot`) должен оставаться тонким и не принимать содержательные policy-решения.

## Важно про polling

Polling используется только как локальный baseline transport-путь.
Webhook, деплой и production-настройки на этом этапе не реализуются.
