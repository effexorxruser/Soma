# Soma

Soma — Telegram-first проект бота поддержки и самоорганизации.

На текущем этапе реализован **минимальный transport/config + safety baseline**:
- централизованный `config`-слой с валидацией env;
- polling-based Telegram adapter для локальной разработки;
- allowlist gate для базового контроля доступа;
- отдельный safety/policy слой с **policy-first contract**.

> Важно: здесь **нет** продуктовой conversational-логики, AI-ответов, OpenAI API, БД, состояния диалога и webhook/deployment инфраструктуры.

## Что сейчас умеет runtime

1. Читать env-конфиг через `src/config/env.ts`.
2. Проверять обязательный `TELEGRAM_BOT_TOKEN` перед запуском.
3. Запускать Telegram polling transport.
4. Пропускать входящие сообщения через allowlist (`TELEGRAM_ALLOWED_USER_IDS`, опционально).
5. Нормализовать вход в transport-контекст и передавать его в policy-first contract.
6. Отправлять response payload, выбранный policy слоем.

## Policy-first contract

Контракт расположен в `src/services/safety/contract.ts` и задает границу между transport и policy:
- transport передает `NormalizedInputContext`;
- policy возвращает `PolicyDecision` с `classification`, `outcome`, `response`, `routing`;
- transport не выбирает содержательные ответы сам;
- будущая conversational-логика может подключаться только после policy-оценки.

## Safety baseline (намеренные ограничения)

На текущем этапе Soma:
- не выдает себя за врача, психиатра, психотерапевта или кризисную службу;
- не дает медицинские назначения, дозировки и лечение;
- не имитирует полноценную психологическую помощь;
- в неясных случаях выбирает честный и ограниченный безопасный ответ.

Это сделано намеренно до подключения более сложной логики.

## Структура проекта

- `src/config/` — загрузка и проверка конфигурации.
- `src/bot/telegram/` — тонкий transport: receive -> allowlist -> normalize -> policy -> send.
- `src/services/safety/` — policy-first contract, classifier, decision model, safe responses.
- `src/core/` — bootstrap приложения.
- `tests/` — тесты baseline.
- `docs/` — документация.

## Команды

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run test
```
