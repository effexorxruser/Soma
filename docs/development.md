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

## Tabular regression suite

- Основной regression suite: `tests/services/safety/policy.test.ts`.
- Каждый кейс в таблице включает: описание, input text, expected classification/outcome и expected future-stage flag.
- При добавлении новой эвристики добавляйте строку в эту таблицу, а не отдельный фрагментный тест без необходимости.

## Change checklist для правок classifier

Перед коммитом изменений в classifier проверь:
1. Сохранены приоритеты (`medical > capability > unknown > neutral`).
2. Mixed-input поведение не деградировало.
3. Если менялись weak-marker эвристики — добавлен negative regression case.
4. Сохранена contract consistency (`classification -> outcome -> response -> routing`).
5. Default-safe behavior не ослаблен.
6. Не появился direct path в future conversational stage там, где его быть не должно.

## Правила

- Нельзя чинить один false positive ценой слома mixed-input или priority behavior.
- Новые classifier heuristics должны сопровождаться regression case в tabular suite.
- Policy-first contract и deterministic priorities сохраняются как инвариант.
