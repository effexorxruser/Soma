# Soma

Soma — Telegram-first проект бота поддержки и самоорганизации.

На текущем этапе реализован **минимальный transport/config baseline**:
- централизованный `config`-слой с валидацией env;
- polling-based Telegram adapter для локальной разработки;
- безопасный startup path с понятными ошибками;
- базовые тесты конфигурации и allowlist.

> Важно: здесь **нет** продуктовой логики, AI-ответов, OpenAI API, БД, хранения диалогового состояния и webhook/deployment инфраструктуры.

## Что сейчас умеет runtime

1. Читать env-конфиг через единый модуль `src/config/env.ts`.
2. Проверять обязательный `TELEGRAM_BOT_TOKEN` перед запуском.
3. Запускать Telegram polling transport.
4. Пропускать сообщения через allowlist (`TELEGRAM_ALLOWED_USER_IDS`, опционально).
5. Отвечать текстовой безопасной заглушкой на русском языке.

## Структура проекта

- `src/config/` — загрузка и проверка конфигурации.
- `src/bot/telegram/` — минимальный Telegram transport (adapter/runtime/gate/messages).
- `src/core/` — bootstrap приложения.
- `src/services/` — слой прикладных сервисов (пока placeholder).
- `src/integrations/` — внешние интеграции (пока placeholder).
- `src/storage/` — слой хранения (пока placeholder).
- `src/types/` — общие типы.
- `tests/` — тесты baseline.
- `docs/` — документация.

## Установка

```bash
npm install
```

## Настройка .env

1. Скопируйте шаблон:

```bash
cp .env.example .env
```

2. Заполните минимум:

- `APP_ENV=local`
- `TELEGRAM_BOT_TOKEN=` (обязательно для запуска)
- `TELEGRAM_ALLOWED_USER_IDS=` (опционально, список ID через запятую)
- `LOG_LEVEL=info`

Если `TELEGRAM_ALLOWED_USER_IDS` пустой — бот отвечает всем пользователям.

## Команды

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run test
```

## Почему выбран Telegraf

Использован `telegraf` как легковесный и зрелый путь для Node.js/TypeScript, достаточный для минимального polling baseline без лишней инфраструктуры.

## Следующие шаги

1. Добавить минимальный transport-level логгер (без логирования секретов и PII).
2. Добавить каркас маршрутизации входящих типов сообщений (текст/команды) без продуктовой логики.
3. Вынести безопасные границы диалога в отдельный модуль `services`/`core`.
