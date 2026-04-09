export function isUserAllowed(userId: number | undefined, allowedUserIds: number[]): boolean {
  if (allowedUserIds.length === 0) {
    return true;
  }

  if (!userId) {
    return false;
  }

  return allowedUserIds.includes(userId);
}
