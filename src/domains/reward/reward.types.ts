export type RewardRarity = 'common' | 'rare' | 'super_rare';
export type RewardSourceType = 'official' | 'user' | 'sponsor';
export type RewardContentType = 'text' | 'image' | 'gif' | 'item' | 'coupon';
export type ObtainedSource = 'random' | 'combo' | 'fever' | 'lucky';

export interface RewardChanceModifiers {
  comboMultiplier?: number;
  feverMultiplier?: number;
  eventMultiplier?: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  contentType: RewardContentType;
  contentText?: string;
  imageUrl?: string;
  rarity: RewardRarity;
  sourceType: RewardSourceType;
  isActive: boolean;
  seasonTag?: string;
  createdAt: string;
}

export interface ObtainedReward {
  id: string;
  reward: Reward;
  obtainedAt: string;
  obtainedSource: ObtainedSource;
  isNew: boolean;
}

export interface RewardDrop {
  id: string;
  obtainedRewardId: string;
  reward: Reward;
  x: number;
  y: number;
}
