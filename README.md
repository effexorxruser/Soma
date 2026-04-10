<p align="center">
  <img src="docs/soma-repo-card.png" alt="Soma repository card" width="100%">
</p>

# Soma

Soma — ранний open-source проект Telegram-first бота для поддержки и самоорганизации с **safety-first контрактом**.

Проект намеренно развивается спокойно: без обещаний «магического AI», с явными границами и с приоритетом безопасности над «эффектностью».

## Для кого проект
На текущем этапе реализован **Public Beta Kernel** поверх safety baseline:
- централизованный `config`-слой с валидацией env;
- polling-based Telegram adapter для локальной разработки;
- access gate (`ACCESS_MODE=open|allowlist`) и allowlist;
- отдельный safety/policy слой с **policy-first contract**;
- application orchestrator для product-flow;
- минимальный conversational kernel (deterministic, без медицинских/клинических советов);
- SQLite persistence для users и daily usage;
- free-tier дневной лимит сообщений;
- команды `/start`, `/help`, `/limits`.

## Flow (policy-first)

```text
Telegram text input
-> access gate
-> normalize
-> orchestrator
   -> safety policy
   -> if blocked: policy reply
   -> if allowed: usage/quota check
   -> if quota ok: conversation service + usage increment
-> user reply
```

## Quota behavior

- План по умолчанию: `free`.
- Лимит определяется `FREE_DAILY_MESSAGE_LIMIT`.
- Счетчик usage хранится по ключу `user_id + date_key (UTC YYYY-MM-DD)`.
- При превышении лимита бот возвращает quota message и не вызывает conversation stage.

## Storage baseline

SQLite схема (`src/storage/schema.sql`):
- `users` (`user_id`, `plan`, `created_at`, `updated_at`)
- `daily_usage` (`user_id`, `date_key`, `message_count`)

- Для разработчиков, которым важен аккуратный и проверяемый safety baseline.
- Для контрибьюторов, кто хочет развивать честный русскоязычный user layer без имитации клинической помощи.
- Для команд, которым нужен прозрачный пример policy-first архитектуры на ранней стадии.

## Что уже реализовано

- Централизованный `config`-слой с валидацией env.
- Polling-based Telegram transport adapter для локальной разработки.
- Allowlist gate для базового контроля доступа.
- Safety/policy слой с **policy-first contract**.
- Rule-based classifier с детерминированными приоритетами.
- Tabular regression suite как исполняемая спецификация safety/policy поведения.

## Чего проект сейчас не делает

На текущем этапе в Soma **нет**:
- `tests/services/safety/policy.test.ts` содержит tabular regression suite.
- Этот набор кейсов — основная точка проверки непреднамеренных изменений поведения classifier/policy.

- продуктовой conversational-логики;
- AI-ответов и интеграций с LLM API;
- базы данных и долговременного состояния диалога;
- webhook/deployment инфраструктуры;
- медицинской/клинической функциональности.

## Принципы проекта

- **Safety-first**: transport-слой не обходит policy-слой.
- **Honesty over hype**: только реальные возможности текущего stage.
- **Calm UX**: спокойный, неагрессивный, без ложной авторитетности.

## Текущий stage

Сейчас проект находится на **Stage 0 (foundation baseline)**: проверяемая архитектурная основа, safety-контракт и регрессии, но без расширенного продуктового слоя.

## Структура репозитория

- `src/config` — загрузка и валидация конфигурации.
- `src/bot/telegram` — transport pipeline (receive → allowlist → normalize → policy → send).
- `src/services/safety` — classifier, policy mapping и safety messages.
- `tests/services/safety` — tabular regression suite.
- `docs` — архитектура, разработка, vision/roadmap и принципы.

## Быстрый локальный запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Минимально обязательный env:

- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота.

Опционально:

- `APP_ENV` (`local` | `dev` | `test` | `prod`, по умолчанию `local`)
- `LOG_LEVEL` (`debug` | `info` | `warn` | `error`, по умолчанию `info`)
- `TELEGRAM_ALLOWED_USER_IDS` (CSV положительных integer user id)

## Quality gates

Перед PR ожидается зеленый проход:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check`

## Как можно помочь проекту

1. Прочитать [CONTRIBUTING.md](./CONTRIBUTING.md).
2. Проверить открытые issue и выбрать задачу.
3. При изменениях classifier/policy — обязательно добавить/обновить regression cases в табличном suite.
4. Для security/privacy/safety проблем использовать приватный канал из [SECURITY.md](./SECURITY.md).

## Документация

- [Vision](./docs/vision.md)
- [Roadmap](./docs/roadmap.md)
- [Product principles](./docs/product-principles.md)
- [Safety boundaries](./docs/safety.md)
- [Architecture](./docs/architecture.md)
- [Development](./docs/development.md)

## Governance

- Лицензия: [MIT](./LICENSE)
- Правила вклада: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security-процесс: [SECURITY.md](./SECURITY.md)
- Кодекс поведения: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## Важное ограничение

**Soma не заменяет врача, психиатра, психотерапевта или кризисные службы помощи.**
Проект не предназначен для диагностики, лечения или экстренной поддержки.
