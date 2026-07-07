import type { Reward, RewardRarity } from './reward.types';

export const REWARD_RARITIES: RewardRarity[] = [
  'common',
  'rare',
  'super_rare',
  'fever',
];

export const REWARD_RARITY_LABELS: Record<RewardRarity, string> = {
  common: '일반',
  rare: '희귀',
  super_rare: '초희귀',
  fever: '피버',
};

export const REWARD_RARITY_STYLES: Record<
  RewardRarity,
  { chip: string; symbol: string }
> = {
  common: { chip: 'border-mint bg-emerald-50 text-emerald-800', symbol: '별' },
  rare: { chip: 'border-pop bg-pink-50 text-pink-800', symbol: '꽃' },
  super_rare: {
    chip: 'border-sunshine bg-amber-50 text-amber-900',
    symbol: '초',
  },
  fever: {
    chip: 'border-amber-400 bg-orange-50 text-orange-900',
    symbol: 'F',
  },
};

export const REWARD_DROP_CHANCES: Record<RewardRarity, number> = {
  common: 0.04,
  rare: 0.008,
  super_rare: 0.001,
  fever: 0,
};

export const SAMPLE_REWARDS: Reward[] = [
  {
    id: 'reward-kind-phrase-01',
    title: '좋은 바람',
    description: '오늘의 마음에 작은 바람이 지나갑니다.',
    contentType: 'text',
    contentText: '괜찮아. 지금도 잘하고 있어.',
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
    description: '가끔은 아무 이유 없이 예쁜 순간이 나옵니다.',
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
    title: '유리 테마 조각',
    description: '투명한 분위기의 작은 조각.',
    contentType: 'item',
    contentText: '유리 조각',
    rarity: 'rare',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
  {
    id: 'reward-super-ticket-01',
    title: '반짝 예언',
    description: '오늘 일이 좋은 쪽으로 살짝 기울었습니다.',
    contentType: 'coupon',
    contentText: '반짝 예언',
    rarity: 'super_rare',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
  {
    id: 'reward-fever-spark-01',
    title: '피버 스파크',
    description: '피버타임에만 발견되는 따뜻한 불꽃 조각입니다.',
    contentType: 'item',
    contentText: 'FEVER SPARK',
    rarity: 'fever',
    sourceType: 'official',
    isActive: true,
    seasonTag: 'mvp',
    createdAt: '2026-07-07T00:00:00.000Z',
  },
];
