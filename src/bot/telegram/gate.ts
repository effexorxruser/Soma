import type { AccessMode } from '../../config/env.js';

export function isUserAllowed(
  userId: number | undefined,
  allowedUserIds: number[],
  accessMode: AccessMode,
): boolean {
  if (accessMode === 'open') {
    return true;
  }

  if (!userId) {
    return false;
  }

  return allowedUserIds.includes(userId);
}
