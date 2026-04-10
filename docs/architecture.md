# Архитектура Soma (текущий baseline)

Документ фиксирует текущее состояние кода без расширения scope.

## Слои

- **config (`src/config/`)**  
  Загрузка env и валидация обязательных параметров.

- **bot/telegram (`src/bot/telegram/`)**  
  Transport layer: прием update, access gate, нормализация входа, передача в orchestrator, отправка ответа.

- **core (`src/core/`)**  
  Сборка runtime зависимостей и orchestrator, который управляет порядком: policy -> usage/quota -> conversation.

- **services/safety (`src/services/safety/`)**  
  Policy-first классификация, policy outcome и безопасные response-тексты.

- **services/users + services/usage**  
  Профили пользователя и суточные лимиты.

- **services/conversation**  
  Минимальный deterministic conversational kernel, вызывается только после разрешающего policy решения.

- **storage (`src/storage/`)**  
  SQLite и схема таблиц (`users`, `daily_usage`).

## Базовый runtime flow

```text
telegram update
-> gate (open|allowlist)
-> normalize
-> orchestrator
   -> safety policy
   -> usage/quota
   -> conversation (если policy allow + quota ok)
-> reply
```

## Инварианты архитектуры

1. Transport не принимает policy-решений.
2. Нет direct route в conversation в обход policy.
3. Classifier/policy изменения защищаются regression suite.
4. User-facing слой не использует clinical/medical framing.
