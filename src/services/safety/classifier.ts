import type { InputCategory, NormalizedInputContext } from './types.js';

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

const WEAK_MARKERS = ['план', 'анализ', 'помощь'];
const REQUEST_HINTS = ['дай', 'сделай', 'подскажи', 'составь', 'нужен', 'нужно'];

export const CLASSIFICATION_PRIORITIES = [
  'medical_or_therapy_request',
  'capability_request',
  'unknown_or_empty',
  'neutral_message',
] as const;

export function classifyInput(context: NormalizedInputContext): InputCategory {
  const normalized = normalizeText(context.text);

  if (!normalized) {
    return 'unknown_or_empty';
  }

  const hasMedicalBoundary = containsAny(normalized, MEDICAL_KEYWORDS);
  const hasCapabilityBoundary = containsAny(normalized, CAPABILITY_KEYWORDS);

  if (hasMedicalBoundary) {
    return 'medical_or_therapy_request';
  }

  if (hasCapabilityBoundary) {
    return 'capability_request';
  }

  if (isNoisyOrTooShort(normalized) || isWeakMarkerAmbiguousRequest(normalized)) {
    return 'unknown_or_empty';
  }

  return 'neutral_message';
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function containsAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}

function isWeakMarkerAmbiguousRequest(input: string): boolean {
  const hasWeakMarker = containsAny(input, WEAK_MARKERS);
  const hasRequestHint = containsAny(input, REQUEST_HINTS);

  return input.length <= 28 && hasWeakMarker && hasRequestHint;
}

function isNoisyOrTooShort(input: string): boolean {
  const punctuationNormalized = input
    .replace(/[()[\]{}"«»]/g, ' ')
    .replace(/[.!?,;:…]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (punctuationNormalized.length < 2) {
    return true;
  }

  const letters = Array.from(input).filter((char) => /[a-zа-яё]/i.test(char)).length;
  const nonLetters = input.length - letters;

  return letters === 0 || nonLetters > letters * 2;
}
