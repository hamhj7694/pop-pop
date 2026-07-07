import type { Reward, RewardRarity } from './reward.types';

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

export const REWARD_RARITY_STYLES: Record<
  RewardRarity,
  { chip: string; symbol: string }
> = {
  common: { chip: 'border-mint bg-emerald-50 text-emerald-800', symbol: '별' },
  rare: { chip: 'border-pop bg-pink-50 text-pink-800', symbol: '희' },
  super_rare: {
    chip: 'border-sunshine bg-amber-50 text-amber-900',
    symbol: '초',
  },
};

export const REWARD_DROP_CHANCES: Record<RewardRarity, number> = {
  common: 0.04,
  rare: 0.008,
  super_rare: 0.001,
};

export const SAMPLE_REWARDS: Reward[] = [
  {
    id: 'reward-kind-phrase-01',
    title: '좋은 바람',
    description: '오늘의 마음에 작은 바람이 지나갑니다.',
    contentType: 'text',
    contentText: '괜찮아, 지금도 잘 하고 있어.',
    rarity: 'common',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
  {
    id: 'reward-star-piece-01',
    title: '별조각',
    description: '반짝임을 아주 조금 모았습니다.',
    contentType: 'item',
    contentText: '별조각 1개',
    rarity: 'common',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
  {
    id: 'reward-sticker-01',
    title: '말랑 스티커',
    description: '손끝에 남는 작고 말랑한 기분.',
    contentType: 'item',
    contentText: '말랑',
    rarity: 'common',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
  {
    id: 'reward-rare-card-01',
    title: '분홍 구름 카드',
    description: '가끔은 아무 이유 없이 예쁜 장면이 나옵니다.',
    contentType: 'image',
    contentText: '분홍 구름',
    rarity: 'rare',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
  {
    id: 'reward-theme-piece-01',
    title: '젤리 테마 조각',
    description: '쫀득한 분위기의 작은 조각.',
    contentType: 'item',
    contentText: '젤리 조각',
    rarity: 'rare',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
  {
    id: 'reward-super-ticket-01',
    title: '반짝 티켓',
    description: '오늘 운이 좋은 쪽으로 살짝 기울었습니다.',
    contentType: 'coupon',
    contentText: '반짝 티켓',
    rarity: 'super_rare',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
];
