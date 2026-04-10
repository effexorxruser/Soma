# Roadmap

Roadmap консервативный: каждое расширение допускается только при сохранении policy-first contract и regression discipline.

## Stage 0 — Foundation baseline (текущий)

- [x] Telegram transport + access gate.
- [x] Policy-first safety слой.
- [x] Deterministic classifier priorities.
- [x] Tabular regression suite для safety/policy.
- [x] SQLite storage для users и daily usage.
- [x] Базовый community/governance и CI baseline.

## Stage 1 — Controlled product baseline

- [ ] Небольшие расширения user-facing сценариев внутри текущих safety-границ.
- [ ] Укрепление quality gates и test coverage для пограничных случаев.
- [ ] Улучшение developer experience без смены архитектурного контракта.

## Stage 2 — Reliability & maintainability

- [ ] Повышение операционной стабильности (CI, release hygiene, observability baseline).
- [ ] Уточнение долгосрочной модели развития только после валидации Stage 1.

## Вне scope до отдельного решения

- Клинический/медицинский функционал.
- Обход policy-слоя ради прямого «умного ответа».
- Публичные обещания capability, которой нет в кодовой базе.
