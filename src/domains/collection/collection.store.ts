import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CollectedReward } from './collection.types';
import type { ObtainedSource, Reward } from '../reward/reward.types';

interface CollectionState {
  collectedRewards: Record<string, CollectedReward>;
  selectedRewardId: string | null;
  saveReward: (
    reward: Reward,
    obtainedAt: string,
    obtainedSource: ObtainedSource,
  ) => void;
  selectReward: (rewardId: string | null) => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collectedRewards: {},
      selectedRewardId: null,
      saveReward: (reward, obtainedAt, obtainedSource) => {
        set((state) => {
          if (state.collectedRewards[reward.id]) {
            return {};
          }

          return {
            collectedRewards: {
              ...state.collectedRewards,
              [reward.id]: {
                rewardId: reward.id,
                firstObtainedAt: obtainedAt,
                obtainedSource,
              },
            },
            selectedRewardId: state.selectedRewardId ?? reward.id,
          };
        });
      },
      selectReward: (rewardId) => set({ selectedRewardId: rewardId }),
    }),
    {
      name: 'toktok-collection',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ collectedRewards, selectedRewardId }) => ({
        collectedRewards,
        selectedRewardId,
      }),
    },
  ),
);
