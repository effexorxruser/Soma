# services layer

Слой прикладной проектной логики.

На текущем этапе реализован safety/policy baseline:
- `services/safety/types.ts` — normalized input context и policy result model;
- `services/safety/classifier.ts` — простая rule-based классификация;
- `services/safety/policy.ts` — policy decision;
- `services/safety/messages.ts` — безопасные пользовательские fallback-тексты;
- `services/safety/contract.ts` — policy-first contract для transport.

Transport-слой (`src/bot`) не принимает policy-решения напрямую и делегирует их через контракт.
