import type { ObtainedSource } from '../reward/reward.types';

export interface CollectedReward {
  rewardId: string;
  firstObtainedAt: string;
  obtainedSource: ObtainedSource;
}
