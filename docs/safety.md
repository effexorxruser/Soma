# Safety boundaries

## Product boundaries

Soma на текущем этапе:

- не предоставляет медицинские или психиатрические рекомендации;
- не является кризисной службой;
- не выполняет диагностику и не назначает лечение;
- не маскируется под клинического специалиста.

## Safety-first approach

- Любой user-facing ответ проходит через policy-first контракт.
- Transport-слой не принимает policy-решения и не обходит safety layer.
- Classifier имеет детерминированные приоритеты и regression protection.

## Запрещенные решения

- Прямой route transport → conversational logic в обход policy.
- Эвристики, которые снижают приоритет safety ради кажущейся «полезности».
- Ответы, создающие ложное впечатление медицинской авторитетности.
- Публичные обещания функциональности, которой нет в коде.

## Regression discipline

Любые изменения classifier/policy должны подтверждаться tabular regression suite и сохранять contract consistency.
