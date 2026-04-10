import { describe, expect, it } from 'vitest';

import { detectConversationProfile } from '../../../src/services/conversation/render.js';

describe('conversation profile detection: normalization', () => {
  const shortNormalizationCases = [
    ['Привет!', 'greeting_short'],
    ['Здравствуйте.', 'greeting_short'],
    ['добрый вечер', 'greeting_short'],
    ['Ок.', 'acknowledgement_short'],
    ['ясно...', 'acknowledgement_short'],
    ['угу', 'acknowledgement_short'],
    ['ага)', 'acknowledgement_short'],
    ['ну...', 'ambiguous_short'],
    ['ну да', 'ambiguous_short'],
    ['мм', 'ambiguous_short'],
    ['как-то так', 'ambiguous_short'],
    ['не знаю', 'ambiguous_short'],
  ] as const;

  for (const [input, expectedProfile] of shortNormalizationCases) {
    it(`normalizes noisy short input: ${input}`, () => {
      expect(detectConversationProfile(input)).toBe(expectedProfile);
    });
  }
});

describe('conversation profile detection: deterministic mixed-signal priority', () => {
  it('prioritizes state profile over greeting in mixed greeting + state', () => {
    expect(detectConversationProfile('привет, мне тревожно')).toBe('anxiety');
  });

  it('prioritizes overload over confusion for overloaded mixed signal', () => {
    expect(detectConversationProfile('я перегружен и не понимаю, что делать')).toBe('overload');
  });

  it('prioritizes confusion over small_step_request for confused ask', () => {
    expect(detectConversationProfile('я запутался, что делать дальше')).toBe('confusion');
  });

  it('prioritizes overload over soft_state_review', () => {
    expect(detectConversationProfile('помоги разложить по полкам, я перегружен')).toBe('overload');
  });

  it('does not collapse acknowledgement with continuation into short profile', () => {
    expect(detectConversationProfile('ага, и что дальше делать')).toBe('small_step_request');
  });
});
