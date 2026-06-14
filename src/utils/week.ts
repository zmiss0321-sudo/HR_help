export const DEMO_TODAY = '2026-06-13';

const dayMs = 24 * 60 * 60 * 1000;

export function daysSinceOnboard(onboardDate: string, today = DEMO_TODAY) {
  const start = new Date(`${onboardDate}T00:00:00`);
  const end = new Date(`${today}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 1;
  return Math.max(1, Math.floor((end.getTime() - start.getTime()) / dayMs) + 1);
}

export function weekFromOnboard(onboardDate: string, today = DEMO_TODAY) {
  const days = daysSinceOnboard(onboardDate, today);
  if (days <= 7) return 'Week 1';
  if (days <= 14) return 'Week 2';
  if (days <= 21) return 'Week 3';
  return 'Week 4';
}
