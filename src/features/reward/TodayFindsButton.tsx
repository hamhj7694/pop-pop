import { useCollectionStore } from '../../domains/collection/collection.store';
import { REWARD_RARITY_STYLES } from '../../domains/reward/reward.constants';
import { useRewardStore } from '../../domains/reward/reward.store';

interface TodayFindsButtonProps {
  onClick: () => void;
}

export function TodayFindsButton({ onClick }: TodayFindsButtonProps) {
  const obtainedRewards = useRewardStore((state) => state.obtainedRewards);
  const collectionCount = useCollectionStore(
    (state) => Object.keys(state.collectedRewards).length,
  );
  const newCount = obtainedRewards.filter((reward) => reward.isNew).length;
  const recentRewards = obtainedRewards.slice(0, 3);

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
        onClick={onClick}
      >
        수집함 {obtainedRewards.length}/{collectionCount}
        {newCount > 0 && (
          <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-pop px-1 text-xs text-white">
            {newCount}
          </span>
        )}
      </button>
    </div>
  );
}
