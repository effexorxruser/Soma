# Soma

Soma — Telegram-first проект бота поддержки и самоорганизации.

На текущем этапе реализован **минимальный transport/config + safety baseline**:
- централизованный `config`-слой с валидацией env;
- polling-based Telegram adapter для локальной разработки;
- allowlist gate для базового контроля доступа;
- отдельный safety/policy слой с **policy-first contract**;
- детерминированный classifier с приоритетами и false-positive guardrails;
- компактный tabular regression suite как исполняемая спецификация поведения classifier/policy.

> Важно: здесь **нет** продуктовой conversational-логики, AI-ответов, OpenAI API, БД, состояния диалога и webhook/deployment инфраструктуры.

## Classification priorities (deterministic)

1. `medical_or_therapy_request`
2. `capability_request`
3. `unknown_or_empty`
4. `neutral_message`

Classifier intentionally conservative: safety важнее «полезности на вид».

## Где смотреть regression baseline

- `tests/services/safety/policy.test.ts` содержит tabular regression suite.
- Этот набор кейсов — основная точка проверки непреднамеренных изменений поведения.

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
