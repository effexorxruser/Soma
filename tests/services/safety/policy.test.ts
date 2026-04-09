import { describe, expect, it } from 'vitest';

import { CLASSIFICATION_PRIORITIES, classifyInput } from '../../../src/services/safety/classifier.js';
import { createPolicyFirstContract } from '../../../src/services/safety/contract.js';
import { getPolicyMessage } from '../../../src/services/safety/messages.js';
import { evaluateSafetyPolicy } from '../../../src/services/safety/policy.js';
import type { InputCategory, NormalizedInputContext } from '../../../src/services/safety/types.js';

function makeContext(text: string): NormalizedInputContext {
  return {
    source: 'telegram',
    messageKind: 'text',
    text,
    userId: 42,
    username: 'tester',
  };
}

describe('safety classifier priorities', () => {
  it('фиксирует детерминированный порядок приоритетов', () => {
    expect(CLASSIFICATION_PRIORITIES).toEqual([
      'medical_or_therapy_request',
      'capability_request',
      'unknown_or_empty',
      'neutral_message',
    ]);
  });

  it('medical + capability => medical приоритет', () => {
    const text = 'Проанализируй и назначь лечение, укажи дозировку';
    expect(classifyInput(makeContext(text))).toBe('medical_or_therapy_request');
  });

  it('medical + noisy => medical приоритет', () => {
    const text = '### дозировка ???';
    expect(classifyInput(makeContext(text))).toBe('medical_or_therapy_request');
  });

  it('capability + noisy => capability приоритет', () => {
    const text = '!!! проанализируй ???';
    expect(classifyInput(makeContext(text))).toBe('capability_request');
  });

  it('neutral + weak ambiguous marker => unknown_or_empty (safe fallback)', () => {
    const text = 'план?';
    expect(classifyInput(makeContext(text))).toBe('unknown_or_empty');
  });

  it('короткий noisy input c risk-like keyword сохраняет boundary', () => {
    const text = 'лекар?';
    expect(classifyInput(makeContext(text))).toBe('medical_or_therapy_request');
  });
});

describe('safety classifier default-safe behavior', () => {
  it('пустой ввод => unknown_or_empty', () => {
    expect(classifyInput(makeContext('   '))).toBe('unknown_or_empty');
  });

  it('шумный ввод без явных boundary ключей => unknown_or_empty', () => {
    expect(classifyInput(makeContext('...!!!123'))).toBe('unknown_or_empty');
  });

  it('неопределенный короткий ввод => unknown_or_empty', () => {
    expect(classifyInput(makeContext('?'))).toBe('unknown_or_empty');
  });

  it('обычный нейтральный текст => neutral_message', () => {
    expect(classifyInput(makeContext('Привет, это обычное сообщение без специальных запросов'))).toBe(
      'neutral_message',
    );
  });
});

describe('policy-first contract consistency', () => {
  const outcomeByCategory: Record<InputCategory, string> = {
    medical_or_therapy_request: 'refuse_medical_boundary',
    capability_request: 'refuse_capability_boundary',
    unknown_or_empty: 'unsupported_input_fallback',
    neutral_message: 'allow_placeholder_response',
  };

  it('контракт возвращает типизированный decision через evaluate', () => {
    const contract = createPolicyFirstContract();
    const decision = contract.evaluate(makeContext('Привет'));

    expect(decision.classification).toBe('neutral_message');
    expect(decision.outcome).toBe('allow_placeholder_response');
    expect(decision.response.text).toBe(getPolicyMessage('allow_placeholder_response'));
    expect(decision.routing.allowFutureConversationalStage).toBe(true);
  });

  it('classification -> outcome -> response -> routing согласованы для boundary и fallback кейсов', () => {
    const cases: Array<{ text: string; category: InputCategory; futureAllowed: boolean }> = [
      { text: 'Назначь лечение', category: 'medical_or_therapy_request', futureAllowed: false },
      { text: 'Проанализируй меня', category: 'capability_request', futureAllowed: false },
      { text: '??', category: 'unknown_or_empty', futureAllowed: false },
    ];

    for (const testCase of cases) {
      const decision = evaluateSafetyPolicy(makeContext(testCase.text));

      expect(decision.classification).toBe(testCase.category);
      expect(decision.outcome).toBe(outcomeByCategory[testCase.category]);
      expect(decision.response.text).toBe(getPolicyMessage(decision.outcome));
      expect(decision.routing.allowFutureConversationalStage).toBe(testCase.futureAllowed);
    }
  });
});
