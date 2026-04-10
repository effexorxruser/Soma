# Safety boundaries

## Policy-first contract

В Soma любой user-facing ответ проходит через safety/policy слой.

Это означает:

- transport-слой **делегирует** policy-решение, а не принимает его;
- conversation stage может вызываться только после разрешающего policy outcome;
- contract должен оставаться детерминированным и проверяемым тестами.

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
