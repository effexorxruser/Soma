import type { UserRepository } from './repository.js';
import type { UserProfile } from './types.js';

export interface UsersService {
  getOrCreateProfile: (userId: number) => UserProfile;
}

export function createUsersService(repository: UserRepository): UsersService {
  return {
    getOrCreateProfile: (userId) => {
      const existing = repository.getByUserId(userId);
      if (existing) {
        return existing;
      }

      return repository.createIfMissing(userId, 'free');
    },
  };
}
