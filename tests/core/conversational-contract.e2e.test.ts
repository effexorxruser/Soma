import { describe, expect, it } from 'vitest';

import { createAppOrchestrator } from '../../src/core/orchestrator.js';
import { createConversationService } from '../../src/services/conversation/service.js';
import { detectConversationProfile } from '../../src/services/conversation/render.js';
import { createPolicyFirstContract } from '../../src/services/safety/contract.js';
import { getPolicyMessage } from '../../src/services/safety/messages.js';
import type { InputCategory, PolicyOutcome } from '../../src/services/safety/types.js';
import type { UsageService } from '../../src/services/usage/service.js';
import type { UsersService } from '../../src/services/users/service.js';

interface Scenario {
  name: string;
  input: string;
  expectedClassification: InputCategory;
  expectedOutcome: PolicyOutcome;
  expectedRoute: 'policy' | 'conversation';
  expectedKind: 'policy' | 'conversation';
  expectedProfile: string | null;
  expectedSubstrings: string[];
  forbiddenSubstrings?: string[];
  maxLines?: number;
  minLines?: number;
}

const SCENARIOS: Scenario[] = [
  {
    name: 'anxiety: мягкое отражение + маленький шаг',
    input: 'Мне тревожно, все сжимается внутри',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'anxiety',
    expectedSubstrings: ['тревога', 'ближайших 10 минут', 'Маленький шаг'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'overload: сужение фокуса',
    input: 'Я в перегрузе, слишком много задач',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'overload',
    expectedSubstrings: ['перегруз', 'один приоритет', 'Маленький шаг'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'confusion: один понятный фокус',
    input: 'Не понимаю что делать дальше',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'confusion',
    expectedSubstrings: ['Похоже на путаницу', 'один понятный фокус', 'Маленький шаг'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'soft state review: без лишних интерпретаций',
    input: 'Помоги разобрать состояние',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'soft_state_review',
    expectedSubstrings: ['мягко разобрать состояние', 'без лишних интерпретаций', 'Маленький шаг'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'small step request: только один шаг',
    input: 'Какой у меня следующий шаг?',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'small_step_request',
    expectedSubstrings: ['только один шаг', 'до 10 минут', 'Маленький шаг'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'neutral: короткий структурный ответ',
    input: 'Сегодня хочу спокойный вечер',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'neutral',
    expectedSubstrings: ['Вижу ваш контекст', 'один фокус', 'Маленький шаг'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'weak-marker guardrail: план без гиперреакции',
    input: 'Помоги с планом на вечер',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'neutral',
    expectedSubstrings: ['Вижу ваш контекст', 'Маленький шаг'],
    forbiddenSubstrings: ['кризис', 'диагноз', 'лечение'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'false-positive guardrail: анализ отчета',
    input: 'анализ отчета сделал',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'neutral',
    expectedSubstrings: ['Вижу ваш контекст', 'Маленький шаг'],
    forbiddenSubstrings: ['не поддерживает этот тип запроса'],
    minLines: 3,
    maxLines: 4,
  },
  {
    name: 'ambiguous short in allowed path: intentionally minimal',
    input: 'как-то так',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'ambiguous_short',
    expectedSubstrings: ['уточнить одним коротким предложением'],
    forbiddenSubstrings: ['Понял вас.'],
    minLines: 1,
    maxLines: 1,
  },
  {
    name: 'greeting short: приветствие без ambiguous-шаблона',
    input: 'Привет',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'greeting_short',
    expectedSubstrings: ['Здравствуйте.', 'можем спокойно продолжить'],
    forbiddenSubstrings: ['Понял вас.', 'уточнить одним коротким предложением'],
    minLines: 2,
    maxLines: 2,
  },
  {
    name: 'greeting short: формальное приветствие',
    input: 'Здравствуйте',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'greeting_short',
    expectedSubstrings: ['Здравствуйте.', 'можем спокойно продолжить'],
    forbiddenSubstrings: ['Понял вас.'],
    minLines: 2,
    maxLines: 2,
  },
  {
    name: 'acknowledgement short: ок',
    input: 'Ок',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'acknowledgement_short',
    expectedSubstrings: ['Принято.', 'продолжайте в одном коротком сообщении'],
    forbiddenSubstrings: ['уточнить одним коротким предложением'],
    minLines: 2,
    maxLines: 2,
  },
  {
    name: 'acknowledgement short: понял',
    input: 'понял',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'acknowledgement_short',
    expectedSubstrings: ['Принято.', 'одном коротком сообщении'],
    minLines: 2,
    maxLines: 2,
  },
  {
    name: 'acknowledgement short: ясно',
    input: 'ясно',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'acknowledgement_short',
    expectedSubstrings: ['Принято.'],
    minLines: 2,
    maxLines: 2,
  },
  {
    name: 'ambiguous short: ну да остается minimal',
    input: 'ну да',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'ambiguous_short',
    expectedSubstrings: ['уточнить одним коротким предложением'],
    minLines: 1,
    maxLines: 1,
  },
  {
    name: 'ambiguous short: мм остается minimal',
    input: 'мм',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'ambiguous_short',
    expectedSubstrings: ['уточнить одним коротким предложением'],
    minLines: 1,
    maxLines: 1,
  },
  {
    name: 'unknown short noise: policy fallback',
    input: '?',
    expectedClassification: 'unknown_or_empty',
    expectedOutcome: 'unsupported_input_fallback',
    expectedRoute: 'policy',
    expectedKind: 'policy',
    expectedProfile: null,
    expectedSubstrings: [getPolicyMessage('unsupported_input_fallback')],
    minLines: 1,
    maxLines: 2,
  },
  {
    name: 'unknown noisy symbols: policy fallback',
    input: '...!!!123',
    expectedClassification: 'unknown_or_empty',
    expectedOutcome: 'unsupported_input_fallback',
    expectedRoute: 'policy',
    expectedKind: 'policy',
    expectedProfile: null,
    expectedSubstrings: [getPolicyMessage('unsupported_input_fallback')],
  },
  {
    name: 'weak-marker ambiguous request stays fallback',
    input: 'Нужен план?',
    expectedClassification: 'unknown_or_empty',
    expectedOutcome: 'unsupported_input_fallback',
    expectedRoute: 'policy',
    expectedKind: 'policy',
    expectedProfile: null,
    expectedSubstrings: [getPolicyMessage('unsupported_input_fallback')],
  },
  {
    name: 'capability boundary remains blocked',
    input: 'Проанализируй меня и дай точный план',
    expectedClassification: 'capability_request',
    expectedOutcome: 'refuse_capability_boundary',
    expectedRoute: 'policy',
    expectedKind: 'policy',
    expectedProfile: null,
    expectedSubstrings: [getPolicyMessage('refuse_capability_boundary')],
  },
  {
    name: 'medical boundary remains blocked',
    input: 'Подскажи лечение и дозировку',
    expectedClassification: 'medical_or_therapy_request',
    expectedOutcome: 'refuse_medical_boundary',
    expectedRoute: 'policy',
    expectedKind: 'policy',
    expectedProfile: null,
    expectedSubstrings: [getPolicyMessage('refuse_medical_boundary')],
  },
  {
    name: 'medical priority beats capability',
    input: 'Проанализируй и назначь лечение',
    expectedClassification: 'medical_or_therapy_request',
    expectedOutcome: 'refuse_medical_boundary',
    expectedRoute: 'policy',
    expectedKind: 'policy',
    expectedProfile: null,
    expectedSubstrings: [getPolicyMessage('refuse_medical_boundary')],
  },
  {
    name: 'capability boundary with noisy punctuation',
    input: '!!! проанализируй ???',
    expectedClassification: 'capability_request',
    expectedOutcome: 'refuse_capability_boundary',
    expectedRoute: 'policy',
    expectedKind: 'policy',
    expectedProfile: null,
    expectedSubstrings: [getPolicyMessage('refuse_capability_boundary')],
  },
  {
    name: 'false-positive guardrail: бытовой план',
    input: 'План на вечер: дом и магазин',
    expectedClassification: 'neutral_message',
    expectedOutcome: 'allow_placeholder_response',
    expectedRoute: 'conversation',
    expectedKind: 'conversation',
    expectedProfile: 'neutral',
    expectedSubstrings: ['Вижу ваш контекст', 'Маленький шаг'],
    forbiddenSubstrings: ['не поддерживает этот тип запроса'],
    minLines: 3,
    maxLines: 4,
  },
];

function lineCount(value: string): number {
  return value.split('\n').length;
}

describe('conversational contract v1: end-to-end golden scenarios', () => {
  const policyContract = createPolicyFirstContract();
  const usersService: UsersService = {
    getOrCreateProfile: (userId) => ({ userId, plan: 'free', createdAt: '', updatedAt: '' }),
  };
  const usageService: UsageService = {
    getDailySnapshot: () => ({ key: { userId: 7, dateKey: '2026-04-10' }, messageCount: 0 }),
    getLimitDecision: () => ({ limit: 50, used: 0, remaining: 50, exceeded: false }),
    incrementDailyUsage: () => ({ key: { userId: 7, dateKey: '2026-04-10' }, messageCount: 1 }),
  };
  const orchestrator = createAppOrchestrator({
    policyContract,
    usersService,
    usageService,
    conversationService: createConversationService(),
    freeDailyMessageLimit: 50,
  });

  for (const scenario of SCENARIOS) {
    it(scenario.name, async () => {
      const context = {
        source: 'telegram' as const,
        messageKind: 'text' as const,
        text: scenario.input,
        userId: 7,
      };

      const policyDecision = policyContract.evaluate(context);
      expect(policyDecision.classification).toBe(scenario.expectedClassification);
      expect(policyDecision.outcome).toBe(scenario.expectedOutcome);
      expect(policyDecision.routing.allowFutureConversationalStage).toBe(scenario.expectedRoute === 'conversation');
      if (scenario.expectedProfile) {
        expect(detectConversationProfile(scenario.input)).toBe(scenario.expectedProfile);
      }

      const result = await orchestrator.handleText(context);
      expect(result.kind).toBe(scenario.expectedKind);

      for (const expectedText of scenario.expectedSubstrings) {
        expect(result.text).toContain(expectedText);
      }

      for (const forbiddenText of scenario.forbiddenSubstrings ?? []) {
        expect(result.text).not.toContain(forbiddenText);
      }

      if (scenario.minLines) {
        expect(lineCount(result.text)).toBeGreaterThanOrEqual(scenario.minLines);
      }

      if (scenario.maxLines) {
        expect(lineCount(result.text)).toBeLessThanOrEqual(scenario.maxLines);
      }
    });
  }
});
