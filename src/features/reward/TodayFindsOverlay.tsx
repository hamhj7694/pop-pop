import { useMemo, useState } from 'react';
import {
  REWARD_RARITIES,
  REWARD_RARITY_LABELS,
  REWARD_RARITY_STYLES,
} from '../../domains/reward/reward.constants';
import { useRewardStore } from '../../domains/reward/reward.store';
import type { RewardRarity } from '../../domains/reward/reward.types';

interface TodayFindsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type RewardFilter = 'all' | RewardRarity;

const FILTERS: Array<{ label: string; value: RewardFilter }> = [
  { label: '전체', value: 'all' },
  ...REWARD_RARITIES.map((rarity) => ({
    label: REWARD_RARITY_LABELS[rarity],
    value: rarity,
  })),
];

export function TodayFindsOverlay({ isOpen, onClose }: TodayFindsOverlayProps) {
  const [filter, setFilter] = useState<RewardFilter>('all');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const obtainedRewards = useRewardStore((state) => state.obtainedRewards);
  const selectedRewardId = useRewardStore((state) => state.selectedRewardId);
  const markAllSeen = useRewardStore((state) => state.markAllSeen);
  const selectReward = useRewardStore((state) => state.selectReward);
  const filteredRewards = useMemo(
    () =>
      filter === 'all'
        ? obtainedRewards
        : obtainedRewards.filter(
            (obtainedReward) => obtainedReward.reward.rarity === filter,
          ),
    [filter, obtainedRewards],
  );
  const selectedReward =
    obtainedRewards.find(
      (obtainedReward) => obtainedReward.id === selectedRewardId,
    ) ??
    filteredRewards[0] ??
    null;

  if (!isOpen) {
    return null;
  }

  const detailContent = selectedReward ? (
    <>
      <span
        className={[
          'inline-flex rounded-full border px-2 py-0.5 text-xs font-bold',
          REWARD_RARITY_STYLES[selectedReward.reward.rarity].chip,
        ].join(' ')}
      >
        {REWARD_RARITY_LABELS[selectedReward.reward.rarity]}
      </span>
      <h3 className="mt-3 text-lg font-bold">{selectedReward.reward.title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        {selectedReward.reward.description}
      </p>
      {selectedReward.reward.contentText && (
        <p className="mt-4 rounded-md bg-white p-3 text-sm font-semibold">
          {selectedReward.reward.contentText}
        </p>
      )}
      <p className="mt-4 text-xs text-slate-500">
        획득: {new Date(selectedReward.obtainedAt).toLocaleString()}
      </p>
      <button
        type="button"
        className="mt-4 h-10 w-full rounded-md bg-ink px-3 text-sm font-bold text-white"
      >
        도감에 저장
      </button>
    </>
  ) : (
    <p className="text-sm text-slate-500">
      보상을 선택하면 자세히 볼 수 있어요.
    </p>
  );

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-30 h-[82vh] overflow-hidden rounded-t-lg border border-slate-200 bg-white shadow-2xl"
      aria-label="오늘 주운 것들"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3 p-4">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">오늘 주운 것들</h2>
            <p className="text-sm text-slate-500">
              {obtainedRewards.length}개를 주웠어요.
            </p>
          </div>
          <button
            type="button"
            className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold"
            onClick={() => {
              markAllSeen();
              onClose();
            }}
          >
            닫기
          </button>
        </header>

        <div className="flex shrink-0 flex-wrap gap-2">
          {FILTERS.map((option) => (
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
              {option.label}
            </button>
          ))}
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
            {filteredRewards.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                아직 이 희귀도의 보상은 없어요.
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRewards.map((obtainedReward) => {
                  const style = REWARD_RARITY_STYLES[obtainedReward.reward.rarity];
                  const isSelected = selectedReward?.id === obtainedReward.id;

                  return (
                    <button
                      key={obtainedReward.id}
                      type="button"
                      className={[
                        'rounded-md border p-3 text-left shadow-sm transition',
                        isSelected
                          ? 'border-pop bg-pink-50'
                          : 'border-slate-200 bg-white hover:border-slate-300',
                      ].join(' ')}
                      onClick={() => {
                        selectReward(obtainedReward.id);
                        setMobileView('detail');
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span
                          className={[
                            'rounded-full border px-2 py-0.5 text-xs font-bold',
                            style.chip,
                          ].join(' ')}
                        >
                          {REWARD_RARITY_LABELS[obtainedReward.reward.rarity]}
                        </span>
                        {obtainedReward.isNew && (
                          <span className="rounded-full bg-pop px-2 py-0.5 text-xs font-bold text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="font-bold">{obtainedReward.reward.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {obtainedReward.reward.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
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
            {detailContent}
          </aside>
        </div>
      </div>
    </section>
  );
}
