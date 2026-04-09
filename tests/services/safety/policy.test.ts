import { describe, expect, it } from 'vitest';

import { classifyInput } from '../../../src/services/safety/classifier.js';
import { createPolicyFirstContract } from '../../../src/services/safety/contract.js';
import { getPolicyMessage } from '../../../src/services/safety/messages.js';
import { evaluateSafetyPolicy } from '../../../src/services/safety/policy.js';
import type { NormalizedInputContext } from '../../../src/services/safety/types.js';

function makeContext(text: string): NormalizedInputContext {
  return {
    source: 'telegram',
    messageKind: 'text',
    text,
    userId: 42,
    username: 'tester',
  };
}

describe('safety classifier', () => {
  it('определяет медицинский/терапевтический запрос', () => {
    expect(classifyInput(makeContext('Подскажи дозировку лекарства'))).toBe('medical_or_therapy_request');
  });

  it('определяет запрос за границей возможностей', () => {
    expect(classifyInput(makeContext('Проанализируй меня и дай точный план'))).toBe(
      'capability_request',
    );
  });

  it('возвращает neutral для обычного текста', () => {
    expect(classifyInput(makeContext('Привет, это тестовое сообщение'))).toBe('neutral_message');
  });

  it('возвращает unknown для пустого текста', () => {
    expect(classifyInput(makeContext('   '))).toBe('unknown_or_empty');
  });
});

describe('policy-first contract', () => {
  it('контракт возвращает типизированный decision через evaluate', () => {
    const contract = createPolicyFirstContract();
    const decision = contract.evaluate(makeContext('Привет'));

    expect(decision.classification).toBe('neutral_message');
    expect(decision.outcome).toBe('allow_placeholder_response');
    expect(decision.response.text).toBe(getPolicyMessage('allow_placeholder_response'));
    expect(decision.routing.allowFutureConversationalStage).toBe(true);
  });

  it('для capability request возвращает boundary refusal', () => {
    const decision = evaluateSafetyPolicy(makeContext('Дай точный план и гарантию'));

    expect(decision.outcome).toBe('refuse_capability_boundary');
    expect(decision.response.text).toBe(getPolicyMessage('refuse_capability_boundary'));
    expect(decision.routing.allowFutureConversationalStage).toBe(false);
  });

  it('для medical request возвращает medical boundary refusal', () => {
    const decision = evaluateSafetyPolicy(makeContext('Назначь лечение и лекарство'));

    expect(decision.outcome).toBe('refuse_medical_boundary');
    expect(decision.response.text).toBe(getPolicyMessage('refuse_medical_boundary'));
    expect(decision.routing.allowFutureConversationalStage).toBe(false);
  });

  it('для неподдерживаемого ввода возвращает fallback', () => {
    const decision = evaluateSafetyPolicy(makeContext(''));

    expect(decision.outcome).toBe('unsupported_input_fallback');
    expect(decision.response.text).toBe(getPolicyMessage('unsupported_input_fallback'));
    expect(decision.routing.allowFutureConversationalStage).toBe(false);
  });
});
