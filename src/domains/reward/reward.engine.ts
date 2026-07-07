import {
  REWARD_DROP_CHANCES,
  REWARD_RARITIES,
  SAMPLE_REWARDS,
} from './reward.constants';
import type { Reward, RewardChanceModifiers, RewardRarity } from './reward.types';

function getChanceMultiplier(modifiers?: RewardChanceModifiers) {
  return (
    (modifiers?.comboMultiplier ?? 1) *
    (modifiers?.feverMultiplier ?? 1) *
    (modifiers?.eventMultiplier ?? 1)
  );
}

function pickRewardByRarity(rarity: RewardRarity): Reward | null {
  const rewards = SAMPLE_REWARDS.filter(
    (reward) => reward.isActive && reward.rarity === rarity,
  );

  if (rewards.length === 0) {
    return null;
  }

  return rewards[Math.floor(Math.random() * rewards.length)];
}

export function rollRandomReward(
  modifiers?: RewardChanceModifiers,
): Reward | null {
  const multiplier = getChanceMultiplier(modifiers);

  for (const rarity of [...REWARD_RARITIES].reverse()) {
    const chance = REWARD_DROP_CHANCES[rarity] * multiplier;

    if (Math.random() <= chance) {
      return pickRewardByRarity(rarity);
    }
  }

  return null;
}
