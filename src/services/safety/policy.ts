import { classifyInput } from './classifier.js';
import { getPolicyMessage } from './messages.js';
import type { PolicyDecision, PolicyInput, PolicyOutcome } from './types.js';

export function evaluateSafetyPolicy(input: PolicyInput): PolicyDecision {
  const category = classifyInput(input.text);

  const outcome: PolicyOutcome =
    category === 'neutral_message'
      ? 'allow_placeholder_response'
      : category === 'capability_request'
        ? 'refuse_capability_boundary'
        : category === 'medical_or_therapy_request'
          ? 'refuse_medical_boundary'
          : 'unsupported_input_fallback';

  return {
    category,
    outcome,
    responseText: getPolicyMessage(outcome),
  };
}
