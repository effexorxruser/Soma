# Safety boundaries

## Policy-first contract

В Soma любой user-facing ответ проходит через safety/policy слой.

Это означает:

- transport-слой **делегирует** policy-решение, а не принимает его;
- conversation stage может вызываться только после разрешающего policy outcome;
- contract должен оставаться детерминированным и проверяемым тестами.

Conversational behavior v1 фиксируется отдельно и расширяется только поверх policy-first контура:
- [`conversational-contract-v1.md`](./conversational-contract-v1.md) — source of truth для `input -> classification -> routing -> response`;
- `tests/core/conversational-contract.e2e.test.ts` — golden/e2e regression набор на продуктовый ответ.
- `tests/services/conversation/render.test.ts` — deterministic regression для normalization и mixed-signal profile priority.

## Product boundaries

Soma на текущем этапе:

- не медицинский сервис;
- не психотерапевтический сервис;
- не кризисная линия помощи;
- не система диагностики/лечения.

## Что считается нарушением

- Любой direct path transport -> conversation без policy-check.
- Снижение приоритета safety в classifier ради «более удобного» ответа.
- User-facing тексты, создающие ложное впечатление клинической экспертизы.
- Документация, обещающая функции, не реализованные в коде.

## Regression discipline

Изменения classifier/policy требуют:

1. Обновления tabular regression suite.
2. Подтверждения сохранения deterministic priorities.
3. Подтверждения, что policy-first routing не деградировал.

Изменения conversation shape требуют:

1. Обновления canonical scenario set в `conversational-contract-v1.md`.
2. Обновления golden/e2e suite, включая real-world noisy scenario pack.
3. Проверки, что weak-marker guardrails и anti-hyperreaction кейсы не деградировали.
