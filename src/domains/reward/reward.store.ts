import { create } from 'zustand';
import type {
  ObtainedReward,
  ObtainedSource,
  Reward,
  RewardChanceModifiers,
  RewardDrop,
} from './reward.types';
import { rollRandomReward } from './reward.engine';
import { useCollectionStore } from '../collection/collection.store';

interface TryRewardDropOptions {
  x: number;
  y: number;
  modifiers?: RewardChanceModifiers;
  obtainedSource?: ObtainedSource;
}

interface RewardState {
  obtainedRewards: ObtainedReward[];
  activeDrops: RewardDrop[];
  revealedReward: ObtainedReward | null;
  selectedRewardId: string | null;
  tryRewardDrop: (options: TryRewardDropOptions) => RewardDrop | null;
  dismissDrop: (dropId: string) => void;
  claimDrop: (dropId: string) => ObtainedReward | null;
  clearRevealedReward: () => void;
  markAllSeen: () => void;
  selectReward: (obtainedRewardId: string | null) => void;
}

function createObtainedReward(
  reward: Reward,
  obtainedSource: ObtainedSource,
): ObtainedReward {
  return {
    id: `obtained-${reward.id}-${crypto.randomUUID()}`,
    reward,
    obtainedAt: new Date().toISOString(),
    obtainedSource,
    isNew: true,
  };
}

function createDrop(
  reward: Reward,
  x: number,
  y: number,
  obtainedSource: ObtainedSource,
): RewardDrop {
  return {
    id: `drop-${reward.id}-${crypto.randomUUID()}`,
    reward,
    x,
    y,
    containerType: Math.random() > 0.45 ? 'gift' : 'card',
    obtainedSource,
    createdAt: new Date().toISOString(),
  };
}

export const useRewardStore = create<RewardState>((set) => ({
  obtainedRewards: [],
  activeDrops: [],
  revealedReward: null,
  selectedRewardId: null,
  tryRewardDrop: ({
    x,
    y,
    modifiers,
    obtainedSource = 'random',
  }: TryRewardDropOptions) => {
    const reward = rollRandomReward(modifiers);

    if (!reward) {
      return null;
    }

    const createdDrop = createDrop(reward, x, y, obtainedSource);

    set((state) => {
      const nextDrops = [...state.activeDrops, createdDrop].slice(-7);

      return {
        activeDrops: nextDrops,
      };
    });

    return createdDrop;
  },
  dismissDrop: (dropId) => {
    set((state) => ({
      activeDrops: state.activeDrops.filter((drop) => drop.id !== dropId),
    }));
  },
  claimDrop: (dropId) => {
    const drop = useRewardStore
      .getState()
      .activeDrops.find((currentDrop) => currentDrop.id === dropId);

    if (!drop) {
      return null;
    }

    const obtainedReward = createObtainedReward(
      drop.reward,
      drop.obtainedSource,
    );

    set((state) => ({
      obtainedRewards: [obtainedReward, ...state.obtainedRewards],
      activeDrops: state.activeDrops.filter(
        (currentDrop) => currentDrop.id !== dropId,
      ),
      revealedReward:
        obtainedReward.reward.contentType === 'text' ? obtainedReward : null,
      selectedRewardId: state.selectedRewardId ?? obtainedReward.id,
    }));

    useCollectionStore
      .getState()
      .saveReward(
        obtainedReward.reward,
        obtainedReward.obtainedAt,
        obtainedReward.obtainedSource,
      );

    return obtainedReward;
  },
  clearRevealedReward: () => {
    set({ revealedReward: null });
  },
  markAllSeen: () => {
    set((state) => ({
      obtainedRewards: state.obtainedRewards.map((obtainedReward) => ({
        ...obtainedReward,
        isNew: false,
      })),
    }));
  },
  selectReward: (obtainedRewardId) => {
    set({ selectedRewardId: obtainedRewardId });
  },
}));
