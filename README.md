# Soma

Soma — ранний open-source проект Telegram-first бота для поддержки и самоорганизации с **safety-first контрактом**.

Проект намеренно развивается спокойно: без обещаний «магического AI», с явными границами и с приоритетом безопасности над «эффектностью».

## Для кого проект

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
