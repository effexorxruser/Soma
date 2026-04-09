import { describe, expect, it } from 'vitest';

import { createAppContext } from '../src/core/app.js';

describe('baseline smoke', () => {
  it('создает контекст приложения с безопасным env по умолчанию', () => {
    const context = createAppContext(undefined);

    expect(context.appName).toBe('Soma');
    expect(context.environment).toBe('local');
  });
});
