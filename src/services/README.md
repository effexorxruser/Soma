# services layer

Слой прикладной проектной логики.

На текущем этапе реализован только safety/policy baseline:
- `services/safety/classifier.ts` — простая rule-based классификация;
- `services/safety/policy.ts` — выбор policy outcome;
- `services/safety/messages.ts` — безопасные пользовательские fallback-тексты.

Transport-слой (`src/bot`) не принимает policy-решения напрямую и делегирует их в этот слой.
