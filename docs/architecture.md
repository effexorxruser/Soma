# Стартовая архитектурная рамка Soma (MVP-путь)

Документ описывает текущую минимальную архитектуру. Это не финальная схема.

## Слои

- **config (`src/config/`)**  
  Централизованная загрузка env и валидация обязательных параметров запуска.

- **bot/telegram (`src/bot/telegram/`)**  
  Тонкий transport layer: receive -> allowlist -> normalize -> policy -> send.

- **services/safety (`src/services/safety/`)**  
  Policy-first слой:
  - `types.ts` — normalized input / policy decision contract;
  - `classifier.ts` — rule-based классификация с deterministic priorities;
  - `policy.ts` — mapping classification -> decision/outcome;
  - `messages.ts` — безопасные fallback-тексты;
  - `contract.ts` — стабильный вход для transport и будущих этапов.

## Regression защита поведения

- `tests/services/safety/policy.test.ts` содержит tabular regression suite и выступает как compact executable-spec classifier поведения.
- В этом же файле есть contract regression guard для policy-first boundary (форма decision + базовая routing-consistency).
- Любые изменения classifier должны проходить через regression review по этим кейсам.

## Принцип расширения

Future conversational stage допускается только после безопасного policy result.
Direct path transport -> future logic без policy не допускается.
