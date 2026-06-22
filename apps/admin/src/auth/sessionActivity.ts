const LAST_ACTIVITY_KEY = "portfolio-admin:last-activity";

export function readLastActivity(): number {
  const storedValue = window.sessionStorage.getItem(LAST_ACTIVITY_KEY);
  const timestamp = Number(storedValue);

  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : Date.now();
}

export function saveLastActivity(timestamp: number): void {
  window.sessionStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
}

export function clearLastActivity(): void {
  window.sessionStorage.removeItem(LAST_ACTIVITY_KEY);
}
