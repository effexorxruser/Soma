# Стартовая архитектурная рамка Soma (MVP-путь)

Документ описывает текущую минимальную архитектуру. Это не финальная схема.

## Слои

- **config (`src/config/`)**  
  Централизованная загрузка env и валидация обязательных параметров запуска.

- **bot/telegram (`src/bot/telegram/`)**  
  Тонкий transport layer для polling:
  - принимает вход;
  - применяет allowlist gate;
  - нормализует input context;
  - вызывает policy-first contract;
  - отправляет response payload.

- **services/safety (`src/services/safety/`)**  
  Policy-first слой:
  - `types.ts` — normalized input / policy decision contract;
  - `classifier.ts` — rule-based классификация;
  - `policy.ts` — decision model;
  - `messages.ts` — безопасные fallback-тексты;
  - `contract.ts` — стабильный вход для transport и будущих этапов.

- **core (`src/core/`)**  
  Bootstrap runtime: связывает config и transport, управляет стартом/остановкой.

- **tests (`tests/`)**  
  Тесты конфигурации, allowlist и policy-first contract.

## Текущий flow

env -> config -> startup -> telegram polling -> allowlist gate -> normalize input -> policy evaluation -> response payload -> transport send

## Принцип расширения

Future conversational logic может появиться только после policy.
Direct path transport -> future logic без policy не допускается.

## Текущие ограничения

- Нет OpenAI/LLM routing.
- Нет базы данных и хранения состояния.
- Нет webhook и production deployment-пути.
- Нет реальных сценариев психологической/медицинской помощи.
