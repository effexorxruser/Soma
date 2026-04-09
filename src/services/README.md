# services layer

Слой прикладной проектной логики.

На текущем этапе реализован safety/policy baseline:
- `services/safety/types.ts` — normalized input context и policy result model;
- `services/safety/classifier.ts` — rule-based классификация с приоритетами;
- `services/safety/policy.ts` — policy decision и deterministic mapping;
- `services/safety/messages.ts` — безопасные fallback-тексты;
- `services/safety/contract.ts` — policy-first contract для transport.

Приоритеты classifier: medical > capability > unknown > neutral.
Transport-слой (`src/bot`) не принимает policy-решения напрямую.
