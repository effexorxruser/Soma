# Разработка Soma (transport/config baseline)

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

## Как тестировать allowlist

- `TELEGRAM_ALLOWED_USER_IDS=` (пусто) -> бот отвечает любому пользователю.
- `TELEGRAM_ALLOWED_USER_IDS=123,456` -> бот отвечает только указанным user id.
- Для остальных возвращается короткий нейтральный отказ.

## Важно про polling

Polling используется только как локальный baseline transport-путь.
Webhook, деплой и production-настройки на этом этапе не реализуются.
