import { describe, expect, it } from 'vitest';

import { isUserAllowed } from '../../src/bot/telegram/gate.js';

describe('telegram allowlist gate', () => {
  it('разрешает всех пользователей в open режиме', () => {
    expect(isUserAllowed(100, [1], 'open')).toBe(true);
  });

  it('разрешает пользователя из allowlist в allowlist режиме', () => {
    expect(isUserAllowed(42, [1, 42, 77], 'allowlist')).toBe(true);
  });

  it('блокирует пользователя вне allowlist в allowlist режиме', () => {
    expect(isUserAllowed(100, [1, 42, 77], 'allowlist')).toBe(false);
  });

  it('блокирует, если userId отсутствует и режим allowlist', () => {
    expect(isUserAllowed(undefined, [1], 'allowlist')).toBe(false);
  });
});
