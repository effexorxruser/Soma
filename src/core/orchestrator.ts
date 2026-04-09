import type { ConversationService } from '../services/conversation/service.js';
import type { PolicyFirstContract } from '../services/safety/contract.js';
import type { NormalizedInputContext } from '../services/safety/types.js';
import type { UsageService } from '../services/usage/service.js';
import type { UsersService } from '../services/users/service.js';

export type OrchestratorResultKind = 'command' | 'policy' | 'quota' | 'conversation';

export interface OrchestratorResult {
  kind: OrchestratorResultKind;
  text: string;
}

export interface AppOrchestrator {
  handleText: (context: NormalizedInputContext) => Promise<OrchestratorResult>;
  handleCommand: (command: '/start' | '/help' | '/limits', userId: number) => Promise<OrchestratorResult>;
}

export interface OrchestratorDeps {
  policyContract: PolicyFirstContract;
  usersService: UsersService;
  usageService: UsageService;
  conversationService: ConversationService;
  freeDailyMessageLimit: number;
}

const HELP_TEXT =
  'Soma Public Beta: короткие структурирующие ответы в безопасных границах. Команды: /start, /help, /limits.';

export function createAppOrchestrator(deps: OrchestratorDeps): AppOrchestrator {
  return {
    handleText: async (context) => {
      const decision = deps.policyContract.evaluate(context);

      if (!decision.routing.allowFutureConversationalStage) {
        return {
          kind: 'policy',
          text: decision.response.text,
        };
      }

      const userId = context.userId;
      if (!userId) {
        return {
          kind: 'policy',
          text: decision.response.text,
        };
      }

      const user = deps.usersService.getOrCreateProfile(userId);
      const limitDecision = deps.usageService.getLimitDecision(user.plan, userId);

      if (limitDecision.exceeded) {
        return {
          kind: 'quota',
          text: `Дневной бесплатный лимит исчерпан (${limitDecision.limit} сообщений). Попробуйте снова завтра.`,
        };
      }

      const conversation = deps.conversationService.reply({ text: context.text });
      deps.usageService.incrementDailyUsage(userId);

      return {
        kind: 'conversation',
        text: conversation.text,
      };
    },
    handleCommand: async (command, userId) => {
      const user = deps.usersService.getOrCreateProfile(userId);

      if (command === '/start') {
        return {
          kind: 'command',
          text: `Привет! Это Soma Public Beta.\n${HELP_TEXT}`,
        };
      }

      if (command === '/help') {
        return {
          kind: 'command',
          text: HELP_TEXT,
        };
      }

      const decision = deps.usageService.getLimitDecision(user.plan, userId);

      return {
        kind: 'command',
        text: `План: ${user.plan}. Дневной лимит: ${deps.freeDailyMessageLimit}. Использовано: ${decision.used}. Осталось: ${decision.remaining}.`,
      };
    },
  };
}
