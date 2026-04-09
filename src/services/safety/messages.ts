import type { PolicyOutcome } from './types.js';

const POLICY_MESSAGES: Record<PolicyOutcome, string> = {
  allow_placeholder_response:
    'Soma сейчас на раннем этапе. Я могу только подтвердить сообщение и работать в безопасном ограниченном режиме.',
  refuse_capability_boundary:
    'Сейчас Soma не поддерживает этот тип запроса. Я могу отвечать только в базовом безопасном режиме ранней версии.',
  refuse_medical_boundary:
    'Я не даю медицинские или терапевтические рекомендации и не заменяю врача или кризисную службу.',
  unsupported_input_fallback:
    'Пока не удалось корректно обработать запрос. Попробуйте коротко сформулировать его обычным текстом.',
};

export function getPolicyMessage(outcome: PolicyOutcome): string {
  return POLICY_MESSAGES[outcome];
}
