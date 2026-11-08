let lastId = 0;

export function generateId(): string {
  const now = Date.now();
  lastId = now > lastId ? now : lastId + 1;
  return String(lastId);
}
