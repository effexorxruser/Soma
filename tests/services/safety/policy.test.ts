import { describe, expect, it } from 'vitest';

import { CLASSIFICATION_PRIORITIES } from '../../../src/services/safety/classifier.js';
import { createPolicyFirstContract } from '../../../src/services/safety/contract.js';
import { getPolicyMessage } from '../../../src/services/safety/messages.js';
import type { InputCategory, NormalizedInputContext, PolicyDecision } from '../../../src/services/safety/types.js';

type ExpectedOutcome =
  | 'allow_placeholder_response'
  | 'refuse_capability_boundary'
  | 'refuse_medical_boundary'
  | 'unsupported_input_fallback';

interface RegressionCase {
  name: string;
  text: string;
  expectedClassification: InputCategory;
  expectedOutcome: ExpectedOutcome;
  expectedFutureStage: boolean;
}

function makeContext(text: string): NormalizedInputContext {
  return {
    source: 'telegram',
    messageKind: 'text',
    text,
    userId: 42,
    username: 'tester',
  };
}

const REGRESSION_CASES: RegressionCase[] = [
  {
    name: 'neutral: обычное бытовое сообщение',
    text: 'Привет, как проходит день?',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedFutureStage: true,
  },
  {
    name: 'unknown: пустой ввод',
    text: '   ',
    expectedClassification: 'unknown_or_empty',
    expectedOutcome: 'unsupported_input_fallback',
    expectedFutureStage: false,
  },
  {
    name: 'capability boundary: явный capability запрос',
    text: 'Проанализируй меня и дай точный план',
    expectedClassification: 'capability_request',
    expectedOutcome: 'refuse_capability_boundary',
    expectedFutureStage: false,
  },
  {
    name: 'medical boundary: явный medical запрос',
    text: 'Подскажи лечение и дозировку лекарства',
    expectedClassification: 'medical_or_therapy_request',
    expectedOutcome: 'refuse_medical_boundary',
    expectedFutureStage: false,
  },
  {
    name: 'mixed-input priority: medical + capability => medical',
    text: 'Проанализируй и назначь лечение, укажи дозировку',
    expectedClassification: 'medical_or_therapy_request',
    expectedOutcome: 'refuse_medical_boundary',
    expectedFutureStage: false,
  },
  {
    name: 'mixed-input priority: capability + noisy => capability',
    text: '!!! проанализируй ???',
    expectedClassification: 'capability_request',
    expectedOutcome: 'refuse_capability_boundary',
    expectedFutureStage: false,
  },
  {
    name: 'false-positive guardrail: бытовой текст с weak-marker',
    text: 'План на вечер: дом и магазин',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedFutureStage: true,
  },
  {
    name: 'false-positive guardrail: marker-like токен в нейтральном тексте',
    text: 'Анализ отчета по задачам готов',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedFutureStage: true,
  },
  {
    name: 'short ambiguous weak-marker: marker + request hint => fallback',
    text: 'Нужен план?',
    expectedClassification: 'unknown_or_empty',
    expectedOutcome: 'unsupported_input_fallback',
    expectedFutureStage: false,
  },
  {
    name: 'unknown noisy: шум без boundary сигналов',
    text: '...!!!123',
    expectedClassification: 'unknown_or_empty',
    expectedOutcome: 'unsupported_input_fallback',
    expectedFutureStage: false,
  },
];

describe('safety classifier/policy tabular regression suite', () => {
  const contract = createPolicyFirstContract();

  it('держит детерминированный порядок приоритетов', () => {
    expect(CLASSIFICATION_PRIORITIES).toEqual([
      'medical_or_therapy_request',
      'capability_request',
      'unknown_or_empty',
      'neutral_message',
    ]);
  });

  for (const testCase of REGRESSION_CASES) {
    it(testCase.name, () => {
      const decision = contract.evaluate(makeContext(testCase.text));

      expect(decision.classification).toBe(testCase.expectedClassification);
      expect(decision.outcome).toBe(testCase.expectedOutcome);
      expect(decision.response.text).toBe(getPolicyMessage(testCase.expectedOutcome));
      expect(decision.routing.allowFutureConversationalStage).toBe(testCase.expectedFutureStage);
    });
  }
});

describe('policy contract regression guard', () => {
  it('сохраняет форму PolicyDecision и базовую согласованность полей', () => {
    const contract = createPolicyFirstContract();
    const decision = contract.evaluate(makeContext('Тест'));

    const keys = Object.keys(decision).sort();
    expect(keys).toEqual(['classification', 'outcome', 'response', 'routing']);
    expect(typeof decision.response.text).toBe('string');
    expect(typeof decision.routing.allowFutureConversationalStage).toBe('boolean');
  });

  it('routing остается закрытым для boundary/fallback кейсов', () => {
    const contract = createPolicyFirstContract();

    const boundaryDecisions: PolicyDecision[] = [
      contract.evaluate(makeContext('Назначь лечение')),
      contract.evaluate(makeContext('Проанализируй меня')),
      contract.evaluate(makeContext('??')),
    ];

    for (const decision of boundaryDecisions) {
      expect(decision.routing.allowFutureConversationalStage).toBe(false);
    }
  });
});
