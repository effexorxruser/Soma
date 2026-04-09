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

export type MessageSource = 'telegram';

export type MessageKind = 'text';

export interface NormalizedInputContext {
  source: MessageSource;
  messageKind: MessageKind;
  text: string;
  userId: number | null;
  username?: string;
  receivedAt?: Date;
}

export interface PolicyResponsePayload {
  text: string;
}

export interface PolicyRouting {
  allowFutureConversationalStage: boolean;
}

export interface PolicyDecision {
  classification: InputCategory;
  outcome: PolicyOutcome;
  response: PolicyResponsePayload;
  routing: PolicyRouting;
}
