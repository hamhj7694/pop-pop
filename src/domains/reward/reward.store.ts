import { create } from 'zustand';
import type {
  BoxEffect,
  BoxOpenResult,
  ObtainedReward,
  ObtainedSource,
  Reward,
  RewardChanceModifiers,
  RewardDrop,
} from './reward.types';
import { rollBoxOpenResult, rollRandomReward } from './reward.engine';
import { useCollectionStore } from '../collection/collection.store';
import { useFeverStore } from '../fever/fever.store';

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
  boxEffect: BoxEffect | null;
  selectedRewardId: string | null;
  tryRewardDrop: (options: TryRewardDropOptions) => RewardDrop | null;
  dismissDrop: (dropId: string) => void;
  claimDrop: (dropId: string) => BoxOpenResult | null;
  clearRevealedReward: () => void;
  clearBoxEffect: () => void;
  markAllSeen: () => void;
  selectReward: (obtainedRewardId: string | null) => void;
}

type RewardSet = (
  partial: Partial<RewardState> | ((state: RewardState) => Partial<RewardState>),
) => void;

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
  x: number,
  y: number,
  obtainedSource: ObtainedSource,
  modifiers?: RewardChanceModifiers,
): RewardDrop {
  const floorX = 8 + Math.random() * 84;
  const pileLevel = Math.floor(Math.random() * 4);

  return {
    id: `drop-box-${crypto.randomUUID()}`,
    x,
    y,
    floorX,
    floorBottom: 70 + pileLevel * 14 + Math.random() * 24,
    rotation: -14 + Math.random() * 28,
    obtainedSource,
    modifiers,
    createdAt: new Date().toISOString(),
  };
}

function addObtainedReward(
  set: RewardSet,
  reward: Reward,
  obtainedSource: ObtainedSource,
  revealText = true,
) {
  const obtainedReward = createObtainedReward(reward, obtainedSource);

  set((state) => ({
    obtainedRewards: [obtainedReward, ...state.obtainedRewards],
    revealedReward: revealText ? obtainedReward : state.revealedReward,
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
}

export const useRewardStore = create<RewardState>((set) => ({
  obtainedRewards: [],
  activeDrops: [],
  revealedReward: null,
  boxEffect: null,
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

    const shouldStoreAsCard =
      reward.contentType === 'text' || Math.random() < 0.18;

    if (shouldStoreAsCard) {
      addObtainedReward(set, reward, obtainedSource, true);

      return null;
    }

    const createdDrop = createDrop(x, y, obtainedSource, modifiers);

    set((state) => {
      const nextDrops = [...state.activeDrops, createdDrop].slice(-24);

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

    const result = rollBoxOpenResult(
      (reward, obtainedSource) => ({
        type: 'reward',
        obtainedReward: createObtainedReward(reward, obtainedSource),
      }),
      drop.obtainedSource,
      drop.modifiers,
    );

    set((state) => ({
      activeDrops: state.activeDrops.filter(
        (currentDrop) => currentDrop.id !== dropId,
      ),
    }));

    if (result.type === 'reward') {
      const { obtainedReward } = result;

      set((state) => ({
        obtainedRewards: [obtainedReward, ...state.obtainedRewards],
        revealedReward: obtainedReward,
        selectedRewardId: state.selectedRewardId ?? obtainedReward.id,
      }));

      useCollectionStore
        .getState()
        .saveReward(
          obtainedReward.reward,
          obtainedReward.obtainedAt,
          obtainedReward.obtainedSource,
        );

      return result;
    }

    if (result.effect.type === 'fever_start') {
      useFeverStore.getState().startFever();
    }

    set({ boxEffect: result.effect });

    return result;
  },
  clearRevealedReward: () => {
    set({ revealedReward: null });
  },
  clearBoxEffect: () => {
    set({ boxEffect: null });
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
