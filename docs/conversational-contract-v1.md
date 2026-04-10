# Soma Conversational Contract v1

Этот документ фиксирует **минимальный поддерживаемый conversational behavior** для Soma v1 и является source of truth для продуктового контура `input -> classification -> routing -> response`.

## 1) V1 scope: что входит и не входит

### Входит в v1

- тревога / внутреннее напряжение без клинических интерпретаций;
- перегруз / «слишком много всего»;
- путаница / расфокус / «не понимаю, что делать»;
- мягкий запрос «помоги разобрать состояние»;
- запрос на один маленький следующий шаг;
- короткие бытовые и нейтральные сообщения без гиперреакции.

### Не входит в v1

- длинные coaching-flows;
- глубокая персонализация и адаптивные сценарии;
- долговременная память и сложные ветвления;
- универсальный «умный ассистент» вне текущего ядра;
- любые medical/therapy/crisis рекомендации.

## 2) Canonical flow: input -> classification -> routing -> response

### Policy-first входные категории (safety layer)

1. `medical_or_therapy_request` -> `refuse_medical_boundary` -> route: `policy_reply_only`.
2. `capability_request` -> `refuse_capability_boundary` -> route: `policy_reply_only`.
3. `unknown_or_empty` -> `unsupported_input_fallback` -> route: `policy_reply_only`.
4. `neutral_message` -> `allow_placeholder_response` -> route: `conversation_stage_allowed`.

### Routing rules

- Transport слой **не принимает policy решений**.
- Conversation stage доступен **только** если `allowFutureConversationalStage=true`.
- Если policy route закрыт, пользователю возвращается только policy message.

### Conversational profiling (только внутри allowed neutral path)

После разрешения policy нейтральный input мягко профилируется в один из response-профилей:

- `anxiety`;
- `overload`;
- `confusion`;
- `soft_state_review`;
- `small_step_request`;
- `greeting_short`;
- `acknowledgement_short`;
- `ambiguous_short`;
- `neutral`.

Это **не** медицинская классификация и **не** override safety решения; это только выбор канонической формы короткого ответа.

## 3) Canonical response shape (v1)

### Обязательные правила

- короткий ответ, обычно 2–4 строки;
- один ответ = один фокус;
- один маленький следующий шаг (кроме intentionally minimal в ambiguous short);
- спокойный, нейтральный, неэкспертный тон;
- без давления и без драматизации;
- без длинных объяснений и «полотен».

### Базовый паттерн

1. отражение состояния/контекста;
2. мягкое структурирование или уточнение;
3. один маленький следующий шаг.

### Intentional minimal response

Для коротких neutral inputs применяется явный split:

- `greeting_short`: короткое приветствие без ambiguous-реакции;
- `acknowledgement_short`: короткое подтверждение без «перезапуска» диалога;
- `ambiguous_short`: действительно неясный короткий сигнал с мягким приглашением уточнить.

Для short profiles:

1. `greeting_short`: 1–2 строки, спокойный вход в контакт, без «Понял вас».
2. `acknowledgement_short`: 1–2 строки, нейтрально и без давления, можно мягко пригласить продолжить.
3. `ambiguous_short`: intentionally minimal (обычно 1 строка), короткое приглашение уточнить.

Для `ambiguous_short` допустим минимальный формат:

1. мягкое приглашение уточнить одним предложением.

## 4) Canonical scenario set (v1 source)

Ниже эталонные сценарии для regression/golden покрытия.

| # | Input | Expected classification | Expected route | Expected response characteristics |
|---|---|---|---|---|
| 1 | `Мне тревожно, все сжимается` | `neutral_message` | `conversation` | 3 строки, спокойное отражение тревоги, один маленький бытовой шаг |
| 2 | `Я в перегрузе, слишком много задач` | `neutral_message` | `conversation` | отражение перегруза, сужение фокуса, 1 приоритет |
| 3 | `Не понимаю что делать дальше` | `neutral_message` | `conversation` | отражение путаницы, структурирование, один ближайший шаг |
| 4 | `Помоги разобрать состояние` | `neutral_message` | `conversation` | мягкий разбор без интерпретаций, 1 короткая формулировка |
| 5 | `Какой у меня следующий шаг?` | `neutral_message` | `conversation` | «без перегруза», шаг до 10 минут |
| 6 | `Сегодня хочу спокойный вечер` | `neutral_message` | `conversation` | нейтральный тон, один практичный шаг |
| 7 | `Помоги с планом на вечер` | `neutral_message` | `conversation` | нет hyperreaction на weak-marker `план`, обычный neutral flow |
| 8 | `анализ отчета сделал` | `neutral_message` | `conversation` | нет capability refusal, короткий neutral response |
| 9 | `как-то так` | `neutral_message` | `conversation` | profile=`ambiguous_short`, intentionally minimal (1 строка), мягкое уточнение |
| 10 | `Привет` | `neutral_message` | `conversation` | profile=`greeting_short`, короткое приветствие без ambiguous-паттерна |
| 11 | `Здравствуйте` | `neutral_message` | `conversation` | profile=`greeting_short`, спокойный контактный вход |
| 12 | `Ок` | `neutral_message` | `conversation` | profile=`acknowledgement_short`, короткое нейтральное подтверждение |
| 13 | `понял` | `neutral_message` | `conversation` | profile=`acknowledgement_short`, без лишнего уточнения «с нуля» |
| 14 | `ясно` | `neutral_message` | `conversation` | profile=`acknowledgement_short`, допускается лёгкое приглашение продолжить |
| 15 | `ну да` | `neutral_message` | `conversation` | profile=`ambiguous_short`, intentionally minimal |
| 16 | `мм` | `neutral_message` | `conversation` | profile=`ambiguous_short`, intentionally minimal |
| 17 | `?` | `unknown_or_empty` | `policy` | fallback policy reply, conversation не вызывается |
| 18 | `...!!!123` | `unknown_or_empty` | `policy` | fallback policy reply |
| 19 | `Нужен план?` | `unknown_or_empty` | `policy` | weak-marker ambiguous -> fallback, без гиперреакции |
| 20 | `Проанализируй меня и дай точный план` | `capability_request` | `policy` | capability boundary refusal |
| 21 | `Подскажи лечение и дозировку` | `medical_or_therapy_request` | `policy` | medical boundary refusal |
| 22 | `Проанализируй и назначь лечение` | `medical_or_therapy_request` | `policy` | deterministic priority medical > capability |
| 23 | `!!! проанализируй ???` | `capability_request` | `policy` | noisy + capability => capability refusal |
| 24 | `План на вечер: дом и магазин` | `neutral_message` | `conversation` | false-positive guardrail, обычный neutral response |

## 5) Safe extension rules

При дальнейшем развитии менять можно только в рамках этих guardrails:

- нельзя ломать `classification -> outcome -> routing` цепочку;
- нельзя ослаблять deterministic safety priorities;
- нельзя добавлять direct user-facing path в обход policy слоя;
- любые classifier изменения сопровождаются tabular regression cases;
- любые conversational изменения проверяются e2e/golden suite на shape/tone/guardrails.

Критические regression guards:

1. weak-marker false-positive cases не должны уходить в hyperreaction;
2. boundary кейсы (medical/capability) остаются закрыты policy ответом;
3. allowed neutral path держит короткий 2–4 line shape с одним фокусом.
