import {
  REWARD_DROP_CHANCES,
  REWARD_RARITIES,
  SAMPLE_REWARDS,
} from './reward.constants';
import type {
  BoxEffect,
  BoxOpenResult,
  ObtainedSource,
  Reward,
  RewardChanceModifiers,
  RewardRarity,
} from './reward.types';

function getChanceMultiplier(modifiers?: RewardChanceModifiers) {
  return (
    (modifiers?.comboMultiplier ?? 1) *
    (modifiers?.feverMultiplier ?? 1) *
    (modifiers?.eventMultiplier ?? 1)
  );
}

function getDropChance(
  rarity: RewardRarity,
  modifiers: RewardChanceModifiers | undefined,
  multiplier: number,
) {
  if (rarity === 'fever') {
    return modifiers?.feverExclusiveChance ?? 0;
  }

  return REWARD_DROP_CHANCES[rarity] * multiplier;
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
    const chance = getDropChance(rarity, modifiers, multiplier);

    if (Math.random() <= chance) {
      return pickRewardByRarity(rarity);
    }
  }

  return null;
}

export function rollRewardFromBox(
  modifiers?: RewardChanceModifiers,
): Reward | null {
  const rewardPool = SAMPLE_REWARDS.filter((reward) => reward.isActive);

  if (rewardPool.length === 0) {
    return null;
  }

  const rareBoost = Math.min(
    0.38,
    ((modifiers?.comboMultiplier ?? 1) - 1) * 0.08 +
      ((modifiers?.feverMultiplier ?? 1) - 1) * 0.12,
  );
  const roll = Math.random();

  if (roll < 0.04 + rareBoost) {
    const feverRewards = rewardPool.filter((reward) => reward.rarity === 'fever');

    if (feverRewards.length > 0 && (modifiers?.feverMultiplier ?? 1) > 1) {
      return feverRewards[Math.floor(Math.random() * feverRewards.length)];
    }
  }

  if (roll < 0.12 + rareBoost) {
    const superRareRewards = rewardPool.filter(
      (reward) => reward.rarity === 'super_rare',
    );

    if (superRareRewards.length > 0) {
      return superRareRewards[
        Math.floor(Math.random() * superRareRewards.length)
      ];
    }
  }

  if (roll < 0.34 + rareBoost) {
    const rareRewards = rewardPool.filter((reward) => reward.rarity === 'rare');

    if (rareRewards.length > 0) {
      return rareRewards[Math.floor(Math.random() * rareRewards.length)];
    }
  }

  return rewardPool[Math.floor(Math.random() * rewardPool.length)];
}

export function rollBoxOpenResult(
  createReward: (reward: Reward, obtainedSource: ObtainedSource) => BoxOpenResult,
  obtainedSource: ObtainedSource,
  modifiers?: RewardChanceModifiers,
): BoxOpenResult {
  const feverMultiplier = modifiers?.feverMultiplier ?? 1;
  const rewardChance = feverMultiplier > 1 ? 0.78 : 0.66;
  const feverChance = feverMultiplier > 1 ? 0.06 : 0.1;
  const roll = Math.random();

  if (roll < rewardChance) {
    const reward = rollRewardFromBox(modifiers);

    if (reward) {
      return createReward(reward, obtainedSource);
    }
  }

  const effect: BoxEffect =
    roll < rewardChance + feverChance
      ? {
          id: `box-effect-fever-${crypto.randomUUID()}`,
          type: 'fever_start',
          label: '피버타임',
          message: '피버타임이 시작됐어요!',
        }
      : roll < rewardChance + feverChance + 0.16
        ? {
            id: `box-effect-particles-${crypto.randomUUID()}`,
            type: 'big_particles',
            label: '반짝 폭죽',
            message: '큰 반짝 이펙트가 터졌어요!',
          }
        : {
            id: `box-effect-event-${crypto.randomUUID()}`,
            type: 'event',
            label: '작은 행운',
            message: '다음 상자가 더 기대되는 느낌이에요.',
          };

  return { type: 'effect', effect };
}
