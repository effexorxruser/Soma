# Soma

Soma — Telegram-first проект бота поддержки и самоорганизации.

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

## Classification priorities (deterministic)

1. `medical_or_therapy_request`
2. `capability_request`
3. `unknown_or_empty`
4. `neutral_message`

Classifier intentionally conservative: safety важнее «полезности на вид».

## Где смотреть regression baseline

- `tests/services/safety/policy.test.ts` содержит tabular regression suite.
- Этот набор кейсов — основная точка проверки непреднамеренных изменений поведения classifier/policy.

## Команды

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run test
```
