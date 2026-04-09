import { describe, expect, it, vi } from 'vitest';

import { createAppOrchestrator } from '../../src/core/orchestrator.js';
import type { ConversationService } from '../../src/services/conversation/service.js';
import type { PolicyFirstContract } from '../../src/services/safety/contract.js';
import type { UsageService } from '../../src/services/usage/service.js';
import type { UsersService } from '../../src/services/users/service.js';
import type { NormalizedInputContext, PolicyDecision } from '../../src/services/safety/types.js';

function makeContext(text: string): NormalizedInputContext {
  return {
    source: 'telegram',
    messageKind: 'text',
    text,
    userId: 7,
  };
}

function makeDecision(overrides: Partial<PolicyDecision>): PolicyDecision {
  return {
    classification: 'neutral_message',
    outcome: 'allow_placeholder_response',
    response: { text: 'policy' },
    routing: { allowFutureConversationalStage: true },
    ...overrides,
  };
}

describe('app orchestrator flow', () => {
  it('blocked policy outcome never reaches conversation service', async () => {
    const policyContract: PolicyFirstContract = {
      evaluate: () =>
        makeDecision({
          routing: { allowFutureConversationalStage: false },
          response: { text: 'blocked' },
        }),
    };

    const conversationService: ConversationService = {
      reply: vi.fn(() => ({ text: 'conversation' })),
    };

    const orchestrator = createAppOrchestrator({
      policyContract,
      usersService: { getOrCreateProfile: () => ({ userId: 7, plan: 'free', createdAt: '', updatedAt: '' }) },
      usageService: {
        getDailySnapshot: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 0 }),
        getLimitDecision: () => ({ limit: 3, used: 0, remaining: 3, exceeded: false }),
        incrementDailyUsage: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 1 }),
      },
      conversationService,
      freeDailyMessageLimit: 3,
    });

    const result = await orchestrator.handleText(makeContext('test'));

    expect(result.kind).toBe('policy');
    expect(result.text).toBe('blocked');
    expect(conversationService.reply).not.toHaveBeenCalled();
  });

  it('allowed policy outcome reaches conversation service when quota available', async () => {
    const policyContract: PolicyFirstContract = {
      evaluate: () => makeDecision({}),
    };

    const usageService: UsageService = {
      getDailySnapshot: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 0 }),
      getLimitDecision: () => ({ limit: 3, used: 1, remaining: 2, exceeded: false }),
      incrementDailyUsage: vi.fn(() => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 2 })),
    };

    const conversationService: ConversationService = {
      reply: vi.fn(() => ({ text: 'ok' })),
    };

    const orchestrator = createAppOrchestrator({
      policyContract,
      usersService: { getOrCreateProfile: () => ({ userId: 7, plan: 'free', createdAt: '', updatedAt: '' }) },
      usageService,
      conversationService,
      freeDailyMessageLimit: 3,
    });

    const result = await orchestrator.handleText(makeContext('neutral text'));

    expect(result.kind).toBe('conversation');
    expect(result.text).toBe('ok');
    expect(conversationService.reply).toHaveBeenCalledOnce();
    expect(usageService.incrementDailyUsage).toHaveBeenCalledOnce();
  });

  it('allowed policy outcome returns quota reply when quota exceeded', async () => {
    const policyContract: PolicyFirstContract = {
      evaluate: () => makeDecision({}),
    };

    const usageService: UsageService = {
      getDailySnapshot: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 3 }),
      getLimitDecision: () => ({ limit: 3, used: 3, remaining: 0, exceeded: true }),
      incrementDailyUsage: vi.fn(() => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 4 })),
    };

    const conversationService: ConversationService = {
      reply: vi.fn(() => ({ text: 'ok' })),
    };

    const orchestrator = createAppOrchestrator({
      policyContract,
      usersService: { getOrCreateProfile: () => ({ userId: 7, plan: 'free', createdAt: '', updatedAt: '' }) },
      usageService,
      conversationService,
      freeDailyMessageLimit: 3,
    });

    const result = await orchestrator.handleText(makeContext('neutral text'));

    expect(result.kind).toBe('quota');
    expect(result.text).toContain('исчерпан');
    expect(conversationService.reply).not.toHaveBeenCalled();
    expect(usageService.incrementDailyUsage).not.toHaveBeenCalled();
  });

  it('/limits returns plan and remaining quota', async () => {
    const usersService: UsersService = {
      getOrCreateProfile: () => ({ userId: 7, plan: 'free', createdAt: '', updatedAt: '' }),
    };

    const orchestrator = createAppOrchestrator({
      policyContract: { evaluate: () => makeDecision({}) },
      usersService,
      usageService: {
        getDailySnapshot: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 1 }),
        getLimitDecision: () => ({ limit: 5, used: 1, remaining: 4, exceeded: false }),
        incrementDailyUsage: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 2 }),
      },
      conversationService: { reply: () => ({ text: 'ok' }) },
      freeDailyMessageLimit: 5,
    });

    const result = await orchestrator.handleCommand('/limits', 7);

    expect(result.kind).toBe('command');
    expect(result.text).toContain('План: free');
    expect(result.text).toContain('Осталось: 4');
  });

  it('/start and /help return command texts', async () => {
    const orchestrator = createAppOrchestrator({
      policyContract: { evaluate: () => makeDecision({}) },
      usersService: { getOrCreateProfile: () => ({ userId: 7, plan: 'free', createdAt: '', updatedAt: '' }) },
      usageService: {
        getDailySnapshot: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 0 }),
        getLimitDecision: () => ({ limit: 5, used: 0, remaining: 5, exceeded: false }),
        incrementDailyUsage: () => ({ key: { userId: 7, dateKey: '2026-04-09' }, messageCount: 1 }),
      },
      conversationService: { reply: () => ({ text: 'ok' }) },
      freeDailyMessageLimit: 5,
    });

    const start = await orchestrator.handleCommand('/start', 7);
    const help = await orchestrator.handleCommand('/help', 7);

    expect(start.text).toContain('Soma Public Beta');
    expect(help.text).toContain('/limits');
  });
});
