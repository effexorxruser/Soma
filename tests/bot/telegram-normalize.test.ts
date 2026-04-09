import { describe, expect, it } from 'vitest';

import { normalizeTelegramTextContext } from '../../src/bot/telegram/normalize.js';

describe('telegram normalize boundary', () => {
  it('создает normalized input context без привязки policy к Telegram update', () => {
    const fakeContext = {
      message: { text: 'Привет' },
      from: { id: 777, username: 'demo_user' },
    } as any;

    const normalized = normalizeTelegramTextContext(fakeContext);

    expect(normalized.source).toBe('telegram');
    expect(normalized.messageKind).toBe('text');
    expect(normalized.text).toBe('Привет');
    expect(normalized.userId).toBe(777);
    expect(normalized.username).toBe('demo_user');
  });
});
