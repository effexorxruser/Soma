import type { InputCategory } from './types.js';

const MEDICAL_KEYWORDS = [
  'диагноз',
  'лечение',
  'лекар',
  'дозиров',
  'таблет',
  'антидепресс',
  'психиатр',
  'психотерап',
  'врач',
  'рецепт',
];

const CAPABILITY_KEYWORDS = [
  'проанализируй',
  'дай точный план',
  'поставь диагноз',
  'назначь',
  'как лечить',
  'гарантируй',
  'кризисная помощь',
  'экстренная помощь',
];

export function classifyInput(text: string | undefined): InputCategory {
  if (!text || text.trim().length === 0) {
    return 'unknown_or_empty';
  }

  const normalized = text.toLowerCase().trim();

  if (containsAny(normalized, MEDICAL_KEYWORDS)) {
    return 'medical_or_therapy_request';
  }

  if (containsAny(normalized, CAPABILITY_KEYWORDS)) {
    return 'capability_request';
  }

  if (normalized.length < 2) {
    return 'unknown_or_empty';
  }

  return 'neutral_message';
}

function containsAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}
