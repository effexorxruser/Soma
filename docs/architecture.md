# Стартовая архитектурная рамка Soma (MVP-путь)

Документ описывает текущую минимальную архитектуру. Это не финальная схема.

## Слои

- **config (`src/config/`)**  
  Централизованная загрузка env и валидация обязательных параметров запуска.

- **bot/telegram (`src/bot/telegram/`)**  
  Минимальный transport layer для polling: adapter, runtime-обработчик, allowlist gate, безопасная заглушка ответа.

- **core (`src/core/`)**  
  Bootstrap runtime: связывает config и transport, управляет стартом/остановкой.

- **services (`src/services/`)**  
  Будущий слой прикладной логики поддержки и самоорганизации (пока без реализации).

- **integrations (`src/integrations/`)**  
  Будущие адаптеры внешних API (кроме текущего Telegram transport baseline).

- **storage (`src/storage/`)**  
  Будущий слой хранения данных.

- **types (`src/types/`)**  
  Общие типы проекта.

- **tests (`tests/`)**  
  Тесты конфигурации, allowlist и smoke-проверки baseline.

- **docs (`docs/`)**  
  Краткая документация проекта.

## Минимальный runtime flow

env -> config -> startup -> telegram polling -> message gate -> safe placeholder response

## Текущие ограничения

- Нет OpenAI/LLM routing.
- Нет базы данных и хранения состояния.
- Нет webhook и production deployment-пути.
