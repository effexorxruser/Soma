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
  - `classifier.ts` — rule-based классификация с приоритетами;
  - `policy.ts` — mapping classification -> decision/outcome;
  - `messages.ts` — безопасные fallback-тексты;
  - `contract.ts` — стабильный вход для transport и будущих этапов.

## Classification priorities

Детерминированный порядок:
1. medical boundary
2. capability boundary
3. unknown/fallback
4. neutral

Mixed-input проходит через этот порядок без вероятностных оценок.

## Текущий flow

env -> config -> startup -> telegram polling -> allowlist gate -> normalize input -> classifier -> policy decision -> response payload -> transport send

## Принцип расширения

Future conversational stage допускается только после безопасного policy result.
Direct path transport -> future logic без policy не допускается.
