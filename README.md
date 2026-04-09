# Soma

Soma — Telegram-first проект бота поддержки и самоорганизации.

На текущем этапе реализован **минимальный transport/config + safety baseline**:
- централизованный `config`-слой с валидацией env;
- polling-based Telegram adapter для локальной разработки;
- allowlist gate для базового контроля доступа;
- отдельный safety/policy слой с **policy-first contract**;
- детерминированный rule-based classifier с явными приоритетами mixed-input кейсов.

> Важно: здесь **нет** продуктовой conversational-логики, AI-ответов, OpenAI API, БД, состояния диалога и webhook/deployment инфраструктуры.

## Policy-first contract (кратко)

Контракт в `src/services/safety/contract.ts` задает границу между transport и policy:
- transport передает `NormalizedInputContext`;
- policy возвращает `PolicyDecision` (`classification`, `outcome`, `response`, `routing`);
- transport не выбирает содержательные ответы;
- future conversational stage возможен только после безопасного policy result.

## Classification priorities (deterministic)

Порядок приоритетов в classifier:
1. `medical_or_therapy_request`
2. `capability_request`
3. `unknown_or_empty`
4. `neutral_message`

В спорных/неясных случаях Soma выбирает более безопасный и ограниченный результат.

## Что сейчас умеет runtime

- receive -> allowlist -> normalize -> policy evaluate -> send response payload;
- отвечать только безопасными fallback-сообщениями на русском;
- не имитировать медицинскую/клиническую помощь.

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
