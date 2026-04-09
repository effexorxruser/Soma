export type PolicyOutcome =
  | 'allow_placeholder_response'
  | 'refuse_capability_boundary'
  | 'refuse_medical_boundary'
  | 'unsupported_input_fallback';

export type InputCategory =
  | 'neutral_message'
  | 'capability_request'
  | 'medical_or_therapy_request'
  | 'unknown_or_empty';

export interface PolicyInput {
  text: string | undefined;
}

export interface PolicyDecision {
  category: InputCategory;
  outcome: PolicyOutcome;
  responseText: string;
}
