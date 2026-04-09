import { evaluateSafetyPolicy } from './policy.js';
import type { NormalizedInputContext, PolicyDecision } from './types.js';

export interface PolicyFirstContract {
  evaluate: (context: NormalizedInputContext) => PolicyDecision;
}

export function createPolicyFirstContract(): PolicyFirstContract {
  return {
    evaluate: (context) => evaluateSafetyPolicy(context),
  };
}
