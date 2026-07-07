import { useMemo } from 'react';
import { useCollectionStore } from '../../domains/collection/collection.store';
import { REWARD_RARITY_STYLES } from '../../domains/reward/reward.constants';
import { useRewardStore } from '../../domains/reward/reward.store';
import type { ObtainedReward } from '../../domains/reward/reward.types';

interface TodayFindsButtonProps {
  onClick: () => void;
}

function getUniqueLatestRewards(obtainedRewards: ObtainedReward[]) {
  const latestRewards = new Map<string, ObtainedReward>();

  for (const obtainedReward of obtainedRewards) {
    if (!latestRewards.has(obtainedReward.reward.id)) {
      latestRewards.set(obtainedReward.reward.id, obtainedReward);
    }
  }

  return [...latestRewards.values()];
}

export function TodayFindsButton({ onClick }: TodayFindsButtonProps) {
  const obtainedRewards = useRewardStore((state) => state.obtainedRewards);
  const collectionCount = useCollectionStore(
    (state) => Object.keys(state.collectedRewards).length,
  );
  const todayRewards = useMemo(
    () => getUniqueLatestRewards(obtainedRewards),
    [obtainedRewards],
  );
  const newCount = todayRewards.filter((reward) => reward.isNew).length;
  const recentRewards = todayRewards.slice(0, 3);

  return (
    <div className="flex items-end gap-2">
      {recentRewards.length > 0 && (
        <div className="flex -space-x-2 pb-1" aria-hidden="true">
          {recentRewards.map((obtainedReward) => {
            const style = REWARD_RARITY_STYLES[obtainedReward.reward.rarity];

            return (
              <span
                key={obtainedReward.id}
                className={[
                  'grid h-8 w-8 place-items-center rounded-md border text-xs font-bold shadow-sm',
                  style.chip,
                ].join(' ')}
              >
                {style.symbol}
              </span>
            );
          })}
        </div>
      )}
      <button
        type="button"
        className="relative h-11 rounded-md bg-ink px-4 text-sm font-bold text-white shadow-sm"
        aria-label={`수집함 열기, 오늘 ${todayRewards.length}개, 전체 ${collectionCount}개`}
        onClick={onClick}
      >
        수집함 {todayRewards.length}/{collectionCount}
        {newCount > 0 && (
          <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-pop px-1 text-xs text-white">
            {newCount}
          </span>
        )}
      </button>
    </div>
  );
}
