import { describe, expect, it } from 'vitest';

import { classifyInput } from '../../../src/services/safety/classifier.js';
import { getPolicyMessage } from '../../../src/services/safety/messages.js';
import { evaluateSafetyPolicy } from '../../../src/services/safety/policy.js';

describe('safety classifier', () => {
  it('определяет медицинский/терапевтический запрос', () => {
    expect(classifyInput('Подскажи дозировку лекарства')).toBe('medical_or_therapy_request');
  });

  it('определяет запрос за границей возможностей', () => {
    expect(classifyInput('Проанализируй меня и дай точный план')).toBe('capability_request');
  });

  it('возвращает neutral для обычного текста', () => {
    expect(classifyInput('Привет, это тестовое сообщение')).toBe('neutral_message');
  });

  it('возвращает unknown для пустого текста', () => {
    expect(classifyInput('   ')).toBe('unknown_or_empty');
  });
});

describe('safety policy', () => {
  it('для neutral возвращает safe placeholder', () => {
    const decision = evaluateSafetyPolicy({ text: 'Привет' });

    expect(decision.outcome).toBe('allow_placeholder_response');
    expect(decision.responseText).toBe(getPolicyMessage('allow_placeholder_response'));
  });

  it('для capability request возвращает boundary refusal', () => {
    const decision = evaluateSafetyPolicy({ text: 'Дай точный план и гарантию' });

    expect(decision.outcome).toBe('refuse_capability_boundary');
    expect(decision.responseText).toBe(getPolicyMessage('refuse_capability_boundary'));
  });

  it('для medical request возвращает medical boundary refusal', () => {
    const decision = evaluateSafetyPolicy({ text: 'Назначь лечение и лекарство' });

    expect(decision.outcome).toBe('refuse_medical_boundary');
    expect(decision.responseText).toBe(getPolicyMessage('refuse_medical_boundary'));
  });

  it('для неподдерживаемого ввода возвращает fallback', () => {
    const decision = evaluateSafetyPolicy({ text: '' });

    expect(decision.outcome).toBe('unsupported_input_fallback');
    expect(decision.responseText).toBe(getPolicyMessage('unsupported_input_fallback'));
  });
});
