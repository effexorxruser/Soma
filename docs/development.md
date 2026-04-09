# Разработка Soma (transport/config + safety baseline)

## Установка и запуск

```bash
npm install
cp .env.example .env
npm run dev
```

## Основные команды

```bash
npm run build
npm run start
npm run test
npm run lint
npm run format
```

## Где находится policy-first contract

- Контракт и типы: `src/services/safety/types.ts`, `src/services/safety/contract.ts`
- Классификация и policy: `src/services/safety/classifier.ts`, `src/services/safety/policy.ts`
- User-facing fallback-тексты: `src/services/safety/messages.ts`

## Как расширять без поломки transport

1. Добавляйте новые response-path через policy слой, а не через transport.
2. Если нужен новый outcome/ветка, сначала обновляйте contract types.
3. Только после policy можно подключать будущую conversational stage.
4. Прямое подключение transport -> conversational logic без policy запрещено.

## Как тестировать policy behavior

- `tests/services/safety/policy.test.ts` — classification + decision + routing.
- `tests/bot/telegram-normalize.test.ts` — boundary нормализации transport input.
- `tests/bot/allowlist.test.ts` — отдельная проверка access gate.

## Важно

Polling используется только как локальный baseline transport-путь.
Webhook/deployment, OpenAI и продуктовая conversational-логика на этом этапе не реализуются.
