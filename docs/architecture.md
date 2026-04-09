# Стартовая архитектурная рамка Soma (MVP-путь)

Документ описывает текущую минимальную архитектуру. Это не финальная схема.

## Слои

- **config (`src/config/`)**  
  Централизованная загрузка env и валидация обязательных параметров запуска.

- **bot/telegram (`src/bot/telegram/`)**  
  Минимальный transport layer для polling: adapter, runtime-обработчик и allowlist gate.

- **services/safety (`src/services/safety/`)**  
  Safety/policy слой между transport и будущей conversational-логикой:
  - rule-based классификация входящего текста;
  - policy outcomes;
  - безопасные fallback-ответы.

- **core (`src/core/`)**  
  Bootstrap runtime: связывает config и transport, управляет стартом/остановкой.

- **types (`src/types/`)**  
  Общие типы проекта.

- **tests (`tests/`)**  
  Тесты конфигурации, allowlist и safety/policy поведения.

- **docs (`docs/`)**  
  Краткая документация проекта.

## Минимальный runtime flow

env -> config -> startup -> telegram polling -> allowlist gate -> policy evaluation -> safe fallback response

## Текущие ограничения

- Нет OpenAI/LLM routing.
- Нет базы данных и хранения состояния.
- Нет webhook и production deployment-пути.
- Нет реальных сценариев психологической/медицинской помощи.
