<p align="center">
  <img src="docs/soma-repo-card.png.png" alt="Soma repository card" width="100%">
</p>

# Soma

Soma — open-source Telegram-first проект на Node.js + TypeScript с **safety-first** и **policy-first** контрактом.

Проект находится на раннем этапе (**Public Beta Kernel**) и сознательно сохраняет ограниченный scope: без hype, без имитации клинической помощи и без обещаний того, чего в коде нет.

## Текущий статус проекта

На **2026-04-09** в репозитории реализованы:

- Telegram transport на polling (`telegraf`);
- access gate (`ACCESS_MODE=open|allowlist` + `TELEGRAM_ALLOWED_USER_IDS`);
- нормализация входящего текста;
- policy-first safety слой с детерминированной классификацией и маппингом в outcome;
- orchestrator, который сначала применяет policy, затем quota, затем conversation;
- SQLite persistence для профилей пользователей и daily usage;
- free-tier суточный лимит сообщений;
- команды `/start`, `/help`, `/limits`;
- regression suite для safety/policy и env/config.

## Product boundaries (явные границы)

Soma на текущем этапе:

- **не** оказывает медицинскую, психотерапевтическую или кризисную помощь;
- **не** является системой диагностики или лечения;
- **не** обходит policy-first слой ради «более полезного» ответа;
- **не** обещает несуществующие AI-возможности или скрытые продуктовые сценарии.

Любой user-facing ответ должен проходить через safety/policy contract.

## Архитектурный поток (упрощенно)

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

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

Минимально обязательный env:

- `TELEGRAM_BOT_TOKEN`

Остальные параметры — в `.env.example` и `docs/development.md`.

## Команды разработки

```bash
npm run lint
npm run test
npm run build
npm run check
```

## Документация

### Product и safety

- [Vision](./docs/vision.md)
- [Roadmap](./docs/roadmap.md)
- [Product principles](./docs/product-principles.md)
- [Safety boundaries](./docs/safety.md)

### Техническая документация

- [Docs index](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [Development](./docs/development.md)

### Community и governance

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [SECURITY.md](./SECURITY.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [LICENSE (MIT)](./LICENSE)

## Заметка по `package.json#private`

В `package.json` установлен `"private": true` осознанно, чтобы исключить случайную публикацию незрелого baseline-пакета в npm.
