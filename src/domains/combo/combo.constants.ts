export const COMBO_TIMEOUT_MS = 1200;

export const COMBO_MILESTONES = [10, 50, 100, 300, 500, 1000] as const;

export function getComboRewardMultiplier(combo: number) {
  if (combo >= 1000) {
    return 2.4;
  }

  if (combo >= 500) {
    return 2;
  }

  if (combo >= 300) {
    return 1.75;
  }

  if (combo >= 100) {
    return 1.4;
  }

  if (combo >= 50) {
    return 1.2;
  }

  if (combo >= 10) {
    return 1.08;
  }

  return 1;
}

export function isComboMilestone(combo: number) {
  return COMBO_MILESTONES.some((milestone) => milestone === combo);
}
