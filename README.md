# Soma

Soma — Telegram-first проект бота поддержки и самоорганизации.

На текущем этапе реализован **минимальный transport/config + safety baseline**:
- централизованный `config`-слой с валидацией env;
- polling-based Telegram adapter для локальной разработки;
- allowlist gate для базового контроля доступа;
- отдельный safety/policy слой с безопасными fallback-ответами.

> Важно: здесь **нет** продуктовой conversational-логики, AI-ответов, OpenAI API, БД, состояния диалога и webhook/deployment инфраструктуры.

## Что сейчас умеет runtime

1. Читать env-конфиг через единый модуль `src/config/env.ts`.
2. Проверять обязательный `TELEGRAM_BOT_TOKEN` перед запуском.
3. Запускать Telegram polling transport.
4. Пропускать входящие сообщения через allowlist (`TELEGRAM_ALLOWED_USER_IDS`, опционально).
5. Передавать текст в safety/policy слой и отвечать безопасным fallback-сообщением.

## Safety baseline (намеренные ограничения)

На текущем этапе Soma:
- не выдает себя за врача, психиатра, психотерапевта или кризисную службу;
- не дает медицинские назначения, дозировки и лечение;
- не имитирует полноценную психологическую помощь;
- в неясных случаях выбирает честный и ограниченный безопасный ответ.

Это сделано намеренно до подключения более сложной логики.

## Структура проекта

- `src/config/` — загрузка и проверка конфигурации.
- `src/bot/telegram/` — минимальный Telegram transport (adapter/runtime/gate).
- `src/services/safety/` — классификация входа, policy outcomes, safe fallback messages.
- `src/core/` — bootstrap приложения.
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

1. Добавить более явные policy-правила для рискованных формулировок (без AI-классификации).
2. Добавить минимальный transport-router по типам апдейтов без продуктовой логики.
3. Подготовить безопасный интерфейс для будущего подключения conversational-логики поверх policy слоя.
