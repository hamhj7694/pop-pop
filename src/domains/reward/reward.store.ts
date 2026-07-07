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
  selectedRewardId: string | null;
  tryRewardDrop: (options: TryRewardDropOptions) => RewardDrop | null;
  dismissDrop: (dropId: string) => void;
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
  obtainedReward: ObtainedReward,
  x: number,
  y: number,
): RewardDrop {
  return {
    id: `drop-${obtainedReward.id}`,
    obtainedRewardId: obtainedReward.id,
    reward: obtainedReward.reward,
    x,
    y,
  };
}

export const useRewardStore = create<RewardState>((set) => ({
  obtainedRewards: [],
  activeDrops: [],
  selectedRewardId: null,
  tryRewardDrop: ({
    x,
    y,
    modifiers,
    obtainedSource = 'random',
  }: TryRewardDropOptions) => {
    const obtainedRewardIds = new Set(
      useRewardStore
        .getState()
        .obtainedRewards.map((obtainedReward) => obtainedReward.reward.id),
    );
    const reward = rollRandomReward(modifiers, obtainedRewardIds);

    if (!reward) {
      return null;
    }

    let createdDrop: RewardDrop | null = null;

    set((state) => {
      const obtainedReward = createObtainedReward(reward, obtainedSource);
      createdDrop = createDrop(obtainedReward, x, y);
      const alreadyObtained = state.obtainedRewards.some(
        (currentReward) => currentReward.reward.id === reward.id,
      );

      if (alreadyObtained) {
        createdDrop = null;

        return {};
      }

      return {
        obtainedRewards: [obtainedReward, ...state.obtainedRewards],
        activeDrops: [...state.activeDrops, createdDrop],
        selectedRewardId: state.selectedRewardId ?? obtainedReward.id,
      };
    });

    if (createdDrop) {
      useCollectionStore
        .getState()
        .saveReward(reward, new Date().toISOString(), obtainedSource);
    }

    return createdDrop;
  },
  dismissDrop: (dropId) => {
    set((state) => ({
      activeDrops: state.activeDrops.filter((drop) => drop.id !== dropId),
    }));
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
