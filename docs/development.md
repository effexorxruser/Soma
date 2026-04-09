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

- Контракт/типы: `src/services/safety/contract.ts`, `src/services/safety/types.ts`
- Классификация/решения: `src/services/safety/classifier.ts`, `src/services/safety/policy.ts`
- Fallback-тексты: `src/services/safety/messages.ts`

## Как расширять rule sets безопасно

1. Сначала фиксируйте приоритеты (`medical > capability > unknown > neutral`).
2. Новые эвристики добавляйте в classifier без вероятностных score-моделей.
3. Любая новая эвристика должна сопровождаться регрессионным тестом.
4. Новые user-facing response-path нельзя добавлять напрямую в transport.
5. Новые conversational stages нельзя подключать в обход policy.

## Регрессионные тесты classifier/policy

- `tests/services/safety/policy.test.ts` содержит:
  - mixed-input приоритеты;
  - ambiguous/short/noisy кейсы;
  - default-safe fallback;
  - согласованность classification -> outcome -> response -> routing.
