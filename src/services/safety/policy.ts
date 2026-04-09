import { classifyInput } from './classifier.js';
import { getPolicyMessage } from './messages.js';
import type { InputCategory, NormalizedInputContext, PolicyDecision, PolicyOutcome } from './types.js';

export function evaluateSafetyPolicy(context: NormalizedInputContext): PolicyDecision {
  const classification = classifyInput(context);
  const outcome = mapClassificationToOutcome(classification);

  return {
    classification,
    outcome,
    response: {
      text: getPolicyMessage(outcome),
    },
    routing: {
      allowFutureConversationalStage: classification === 'neutral_message',
    },
  };
}

function mapClassificationToOutcome(classification: InputCategory): PolicyOutcome {
  if (classification === 'neutral_message') {
    return 'allow_placeholder_response';
  }

  if (classification === 'capability_request') {
    return 'refuse_capability_boundary';
  }

  if (classification === 'medical_or_therapy_request') {
    return 'refuse_medical_boundary';
  }

  return 'unsupported_input_fallback';
}
