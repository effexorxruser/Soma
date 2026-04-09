import { describe, expect, it } from 'vitest';

import { isUserAllowed } from '../../src/bot/telegram/gate.js';

describe('telegram allowlist gate', () => {
  it('разрешает всех пользователей, если allowlist пустой', () => {
    expect(isUserAllowed(100, [])).toBe(true);
  });

  it('разрешает пользователя из allowlist', () => {
    expect(isUserAllowed(42, [1, 42, 77])).toBe(true);
  });

  it('блокирует пользователя вне allowlist', () => {
    expect(isUserAllowed(100, [1, 42, 77])).toBe(false);
  });

  it('блокирует, если userId отсутствует и allowlist задан', () => {
    expect(isUserAllowed(undefined, [1])).toBe(false);
  });
});
