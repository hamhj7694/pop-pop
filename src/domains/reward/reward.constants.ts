import type { RewardRarity } from './reward.types';

export const REWARD_RARITIES: RewardRarity[] = [
  'common',
  'rare',
  'super_rare',
];

export const REWARD_RARITY_LABELS: Record<RewardRarity, string> = {
  common: '일반',
  rare: '희귀',
  super_rare: '초희귀',
};
