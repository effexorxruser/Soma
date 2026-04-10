# Разработка Soma

## Требования

- Node.js 20+
- npm 10+

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

## Переменные окружения

Обязательные:

- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота.
- `DATABASE_PATH` — путь к SQLite базе.

Опциональные:

- `APP_ENV` (`local` | `dev` | `test` | `prod`, default: `local`)
- `LOG_LEVEL` (`debug` | `info` | `warn` | `error`, default: `info`)
- `ACCESS_MODE` (`open` | `allowlist`, default: `allowlist`)
- `TELEGRAM_ALLOWED_USER_IDS` — CSV положительных user id
- `FREE_DAILY_MESSAGE_LIMIT` — положительное целое, default: `20`

## Скрипты

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run check
```

## Quality gates для PR

Минимальный baseline перед PR:

1. `npm run lint`
2. `npm run test`
3. `npm run build`

## Инварианты, которые нельзя ломать

- Transport-слой не принимает policy-решения.
- User-facing response path проходит через policy-first contract.
- Deterministic priorities classifier не деградируют.
- Изменения classifier/policy сопровождаются regression-кейсами.

## Заметка по package publishing

В `package.json` установлен `"private": true` осознанно: репозиторий является application baseline, а не npm-пакетом для публикации.
