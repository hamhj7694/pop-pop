import { useMemo, useState } from 'react';
import { useCollectionStore } from '../../domains/collection/collection.store';
import {
  REWARD_RARITIES,
  REWARD_RARITY_LABELS,
  REWARD_RARITY_STYLES,
  SAMPLE_REWARDS,
} from '../../domains/reward/reward.constants';
import type { Reward, RewardRarity } from '../../domains/reward/reward.types';

interface CollectionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type CollectionFilter = 'all' | RewardRarity;

const FILTERS: Array<{ label: string; value: CollectionFilter }> = [
  { label: '전체', value: 'all' },
  ...REWARD_RARITIES.map((rarity) => ({
    label: REWARD_RARITY_LABELS[rarity],
    value: rarity,
  })),
];

function getRate(collectedCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round((collectedCount / totalCount) * 100);
}

function getRewardById(rewardId: string) {
  return SAMPLE_REWARDS.find((reward) => reward.id === rewardId) ?? null;
}

function getRewardLabel(reward: Reward, isCollected: boolean) {
  return isCollected ? reward.title : '???';
}

export function CollectionOverlay({ isOpen, onClose }: CollectionOverlayProps) {
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const collectedRewards = useCollectionStore(
    (state) => state.collectedRewards,
  );
  const selectedRewardId = useCollectionStore(
    (state) => state.selectedRewardId,
  );
  const selectReward = useCollectionStore((state) => state.selectReward);
  const collectedIds = useMemo(
    () => new Set(Object.keys(collectedRewards)),
    [collectedRewards],
  );
  const filteredRewards = useMemo(
    () =>
      filter === 'all'
        ? SAMPLE_REWARDS
        : SAMPLE_REWARDS.filter((reward) => reward.rarity === filter),
    [filter],
  );
  const selectedReward =
    filteredRewards.find((reward) => reward.id === selectedRewardId) ??
    filteredRewards[0] ??
    null;
  const selectedCollection = selectedReward
    ? collectedRewards[selectedReward.id]
    : null;
  const recentCollectedRewards = useMemo(
    () =>
      [...Object.values(collectedRewards)]
        .sort(
          (a, b) =>
            new Date(b.firstObtainedAt).getTime() -
            new Date(a.firstObtainedAt).getTime(),
        )
        .slice(0, 3)
        .map((collection) => getRewardById(collection.rewardId))
        .filter((reward): reward is Reward => Boolean(reward)),
    [collectedRewards],
  );
  const totalCollected = collectedIds.size;
  const totalRate = getRate(totalCollected, SAMPLE_REWARDS.length);

  if (!isOpen) {
    return null;
  }

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-30 h-[86vh] overflow-hidden rounded-t-lg border border-slate-200 bg-white shadow-2xl"
      aria-label="도감"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3 p-4">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">도감</h2>
            <p className="text-sm text-slate-500">
              {totalCollected}/{SAMPLE_REWARDS.length} · {totalRate}%
            </p>
          </div>
          <button
            type="button"
            className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold"
            onClick={onClose}
          >
            닫기
          </button>
        </header>

        <div className="grid shrink-0 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)]">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between text-sm font-bold">
              <span>전체 수집률</span>
              <span>{totalRate}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-pop"
                style={{ width: `${totalRate}%` }}
              />
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-sm font-bold">최근 획득</p>
            <div className="flex min-h-6 gap-1 overflow-hidden">
              {recentCollectedRewards.length === 0 ? (
                <span className="text-sm text-slate-500">아직 없음</span>
              ) : (
                recentCollectedRewards.map((reward) => (
                  <span
                    key={reward.id}
                    className={[
                      'truncate rounded-full border px-2 py-0.5 text-xs font-bold',
                      REWARD_RARITY_STYLES[reward.rarity].chip,
                    ].join(' ')}
                  >
                    {reward.title}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {FILTERS.map((option) => {
            const rewards =
              option.value === 'all'
                ? SAMPLE_REWARDS
                : SAMPLE_REWARDS.filter(
                    (reward) => reward.rarity === option.value,
                  );
            const collectedCount = rewards.filter((reward) =>
              collectedIds.has(reward.id),
            ).length;
            const rate = getRate(collectedCount, rewards.length);

            return (
              <button
                key={option.value}
                type="button"
                className={[
                  'h-9 rounded-md border px-3 text-sm font-semibold',
                  filter === option.value
                    ? 'border-ink bg-ink text-white'
                    : 'border-slate-200 bg-white text-slate-600',
                ].join(' ')}
                onClick={() => {
                  setFilter(option.value);
                  setMobileView('list');
                }}
              >
                {option.label} {rate}%
              </button>
            );
          })}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 md:hidden">
          <button
            type="button"
            className={[
              'h-10 rounded-md border text-sm font-bold',
              mobileView === 'list'
                ? 'border-ink bg-ink text-white'
                : 'border-slate-200 bg-white text-slate-600',
            ].join(' ')}
            onClick={() => setMobileView('list')}
          >
            목록
          </button>
          <button
            type="button"
            className={[
              'h-10 rounded-md border text-sm font-bold',
              mobileView === 'detail'
                ? 'border-ink bg-ink text-white'
                : 'border-slate-200 bg-white text-slate-600',
            ].join(' ')}
            onClick={() => setMobileView('detail')}
          >
            상세
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_20rem]">
          <div
            className={[
              'min-h-0 overflow-y-auto pr-1',
              mobileView === 'detail' ? 'hidden md:block' : 'block',
            ].join(' ')}
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRewards.map((reward) => {
                const isCollected = collectedIds.has(reward.id);
                const isSelected = selectedReward?.id === reward.id;
                const style = REWARD_RARITY_STYLES[reward.rarity];

                return (
                  <button
                    key={reward.id}
                    type="button"
                    className={[
                      'rounded-md border p-3 text-left shadow-sm transition',
                      isSelected
                        ? 'border-pop bg-pink-50'
                        : 'border-slate-200 bg-white hover:border-slate-300',
                      isCollected ? '' : 'text-slate-400',
                    ].join(' ')}
                    onClick={() => {
                      selectReward(reward.id);
                      setMobileView('detail');
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span
                        className={[
                          'rounded-full border px-2 py-0.5 text-xs font-bold',
                          isCollected
                            ? style.chip
                            : 'border-slate-200 bg-slate-50 text-slate-400',
                        ].join(' ')}
                      >
                        {isCollected
                          ? REWARD_RARITY_LABELS[reward.rarity]
                          : '미획득'}
                      </span>
                      <span className="text-xs font-bold">
                        {style.symbol}
                      </span>
                    </div>
                    <p className="font-bold">
                      {getRewardLabel(reward, isCollected)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm">
                      {isCollected ? reward.description : '아직 발견 전'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <aside
            className={[
              'min-h-0 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-4',
              mobileView === 'list' ? 'hidden md:block' : 'block',
            ].join(' ')}
          >
            <button
              type="button"
              className="mb-3 h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold md:hidden"
              onClick={() => setMobileView('list')}
            >
              목록으로
            </button>
            {selectedReward ? (
              <>
                <span
                  className={[
                    'inline-flex rounded-full border px-2 py-0.5 text-xs font-bold',
                    selectedCollection
                      ? REWARD_RARITY_STYLES[selectedReward.rarity].chip
                      : 'border-slate-200 bg-white text-slate-500',
                  ].join(' ')}
                >
                  {selectedCollection
                    ? REWARD_RARITY_LABELS[selectedReward.rarity]
                    : '미획득'}
                </span>
                <h3 className="mt-3 text-lg font-bold">
                  {getRewardLabel(selectedReward, Boolean(selectedCollection))}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedCollection
                    ? selectedReward.description
                    : '아직 발견하지 못한 보상입니다.'}
                </p>
                {selectedCollection && selectedReward.contentText && (
                  <p className="mt-4 rounded-md bg-white p-3 text-sm font-semibold">
                    {selectedReward.contentText}
                  </p>
                )}
                {selectedCollection && (
                  <p className="mt-4 text-xs text-slate-500">
                    첫 획득:{' '}
                    {new Date(
                      selectedCollection.firstObtainedAt,
                    ).toLocaleString()}
                  </p>
                )}
                <p className="mt-4 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                  브라우저 저장
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500">보상이 없습니다.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
