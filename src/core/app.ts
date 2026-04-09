import { createTelegramAdapter } from '../bot/telegram/adapter.js';
import type { AppConfig } from '../config/env.js';
import { createAppOrchestrator } from './orchestrator.js';
import { createConversationService } from '../services/conversation/service.js';
import { createPolicyFirstContract } from '../services/safety/contract.js';
import { createUsageService } from '../services/usage/service.js';
import { createSqliteUsageRepository } from '../services/usage/repository.js';
import { createUsersService } from '../services/users/service.js';
import { createSqliteUserRepository } from '../services/users/repository.js';
import { createSqliteStorage } from '../storage/sqlite.js';

export interface AppRuntime {
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export function createAppRuntime(config: AppConfig): AppRuntime {
  const storage = createSqliteStorage(config.databasePath);
  const userRepository = createSqliteUserRepository(storage.db);
  const usageRepository = createSqliteUsageRepository(storage.db);

  const usersService = createUsersService(userRepository);
  const usageService = createUsageService(usageRepository, config.freeDailyMessageLimit);
  const conversationService = createConversationService();
  const policyContract = createPolicyFirstContract();

  const orchestrator = createAppOrchestrator({
    policyContract,
    usersService,
    usageService,
    conversationService,
    freeDailyMessageLimit: config.freeDailyMessageLimit,
  });

  const telegramAdapter = createTelegramAdapter(config, orchestrator);

  return {
    start: async () => {
      await telegramAdapter.start();
    },
    stop: async () => {
      await telegramAdapter.stop();
      storage.close();
    },
  };
}
