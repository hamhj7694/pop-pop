import { useEffect, useMemo, useState } from 'react';
import { useCollectionStore } from '../../domains/collection/collection.store';
import {
  REWARD_RARITIES,
  REWARD_RARITY_LABELS,
  REWARD_RARITY_STYLES,
  SAMPLE_REWARDS,
} from '../../domains/reward/reward.constants';
import { useRewardStore } from '../../domains/reward/reward.store';
import type {
  ObtainedReward,
  Reward,
  RewardRarity,
} from '../../domains/reward/reward.types';

interface CollectionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type CollectionFilter = 'all' | RewardRarity;
type CollectionView = 'today' | 'catalog';

const FILTERS: Array<{ label: string; value: CollectionFilter }> = [
  { label: '전체', value: 'all' },
  ...REWARD_RARITIES.map((rarity) => ({
    label: REWARD_RARITY_LABELS[rarity],
    value: rarity,
  })),
];

function getRate(collectedCount: number, totalCount: number) {
  return totalCount === 0 ? 0 : Math.round((collectedCount / totalCount) * 100);
}

function getRewardById(rewardId: string) {
  return SAMPLE_REWARDS.find((reward) => reward.id === rewardId) ?? null;
}

function getRewardLabel(reward: Reward, isCollected: boolean) {
  return isCollected ? reward.title : '???';
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

function TodayDetail({ obtainedReward }: { obtainedReward: ObtainedReward }) {
  return (
    <>
      <span
        className={[
          'inline-flex rounded-full border px-2 py-0.5 text-xs font-bold',
          REWARD_RARITY_STYLES[obtainedReward.reward.rarity].chip,
        ].join(' ')}
      >
        {REWARD_RARITY_LABELS[obtainedReward.reward.rarity]}
      </span>
      <h3 className="mt-3 text-lg font-bold">{obtainedReward.reward.title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        {obtainedReward.reward.description}
      </p>
      {obtainedReward.reward.contentText && (
        <p className="mt-4 rounded-md bg-white p-3 text-sm font-semibold">
          {obtainedReward.reward.contentText}
        </p>
      )}
      <p className="mt-4 text-xs text-slate-500">
        획득: {new Date(obtainedReward.obtainedAt).toLocaleString()}
      </p>
      <p className="mt-4 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
        수집함에 반영됨
      </p>
    </>
  );
}

export function CollectionOverlay({ isOpen, onClose }: CollectionOverlayProps) {
  const [view, setView] = useState<CollectionView>('today');
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [selectedTodayId, setSelectedTodayId] = useState<string | null>(null);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(
    null,
  );
  const collectedRewards = useCollectionStore(
    (state) => state.collectedRewards,
  );
  const obtainedRewards = useRewardStore((state) => state.obtainedRewards);
  const markAllSeen = useRewardStore((state) => state.markAllSeen);
  const todayRewards = useMemo(
    () => getUniqueLatestRewards(obtainedRewards),
    [obtainedRewards],
  );
  const collectedIds = useMemo(
    () => new Set(Object.keys(collectedRewards)),
    [collectedRewards],
  );
  const filteredTodayRewards = useMemo(
    () =>
      filter === 'all'
        ? todayRewards
        : todayRewards.filter(
            (obtainedReward) => obtainedReward.reward.rarity === filter,
          ),
    [filter, todayRewards],
  );
  const filteredCatalogRewards = useMemo(
    () =>
      filter === 'all'
        ? SAMPLE_REWARDS
        : SAMPLE_REWARDS.filter((reward) => reward.rarity === filter),
    [filter],
  );
  const selectedTodayReward =
    filteredTodayRewards.find((reward) => reward.id === selectedTodayId) ??
    filteredTodayRewards[0] ??
    null;
  const selectedCatalogReward =
    filteredCatalogRewards.find((reward) => reward.id === selectedCatalogId) ??
    filteredCatalogRewards[0] ??
    null;
  const selectedCollection = selectedCatalogReward
    ? collectedRewards[selectedCatalogReward.id]
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        markAllSeen();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, markAllSeen, onClose]);

  if (!isOpen) {
    return null;
  }

  const closeOverlay = () => {
    markAllSeen();
    onClose();
  };

  const detailContent =
    view === 'today' ? (
      selectedTodayReward ? (
        <TodayDetail obtainedReward={selectedTodayReward} />
      ) : (
        <p className="text-sm text-slate-500">
          아직 오늘 주운 보상이 없어요.
        </p>
      )
    ) : selectedCatalogReward ? (
      <>
        <span
          className={[
            'inline-flex rounded-full border px-2 py-0.5 text-xs font-bold',
            selectedCollection
              ? REWARD_RARITY_STYLES[selectedCatalogReward.rarity].chip
              : 'border-slate-200 bg-white text-slate-500',
          ].join(' ')}
        >
          {selectedCollection
            ? REWARD_RARITY_LABELS[selectedCatalogReward.rarity]
            : '미획득'}
        </span>
        <h3 className="mt-3 text-lg font-bold">
          {getRewardLabel(selectedCatalogReward, Boolean(selectedCollection))}
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          {selectedCollection
            ? selectedCatalogReward.description
            : '아직 발견하지 못한 보상입니다.'}
        </p>
        {selectedCollection && selectedCatalogReward.contentText && (
          <p className="mt-4 rounded-md bg-white p-3 text-sm font-semibold">
            {selectedCatalogReward.contentText}
          </p>
        )}
        {selectedCollection && (
          <p className="mt-4 text-xs text-slate-500">
            첫 획득:{' '}
            {new Date(selectedCollection.firstObtainedAt).toLocaleString()}
          </p>
        )}
        <p className="mt-4 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
          브라우저 저장
        </p>
      </>
    ) : (
      <p className="text-sm text-slate-500">보상이 없습니다.</p>
    );

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-30 h-[86vh] overflow-hidden rounded-t-lg border border-slate-200 bg-white shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-title"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-3 p-4">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div>
            <h2 id="collection-title" className="text-xl font-bold">
              수집함
            </h2>
            <p className="text-sm text-slate-500">
              오늘 {todayRewards.length}개 · 전체 {totalCollected}/
              {SAMPLE_REWARDS.length} · {totalRate}%
            </p>
          </div>
          <button
            type="button"
            className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold"
            onClick={closeOverlay}
          >
            닫기
          </button>
        </header>

        <div className="grid shrink-0 grid-cols-2 gap-2" role="tablist">
          {[
            ['today', '오늘 주운 것들'],
            ['catalog', '전체 수집'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={view === value}
              className={[
                'h-10 rounded-md border text-sm font-bold',
                view === value
                  ? 'border-ink bg-ink text-white'
                  : 'border-slate-200 bg-white text-slate-600',
              ].join(' ')}
              onClick={() => {
                setView(value as CollectionView);
                setMobileView('list');
              }}
            >
              {label}
            </button>
          ))}
        </div>

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
            const catalogRewards =
              option.value === 'all'
                ? SAMPLE_REWARDS
                : SAMPLE_REWARDS.filter(
                    (reward) => reward.rarity === option.value,
                  );
            const todayCount =
              option.value === 'all'
                ? todayRewards.length
                : todayRewards.filter(
                    (reward) => reward.reward.rarity === option.value,
                  ).length;
            const collectedCount = catalogRewards.filter((reward) =>
              collectedIds.has(reward.id),
            ).length;
            const labelSuffix =
              view === 'today'
                ? `${todayCount}`
                : `${getRate(collectedCount, catalogRewards.length)}%`;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
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
                {option.label} {labelSuffix}
              </button>
            );
          })}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2 md:hidden">
          <button
            type="button"
            aria-pressed={mobileView === 'list'}
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
            aria-pressed={mobileView === 'detail'}
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
            {view === 'today' ? (
              filteredTodayRewards.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  아직 이 조건의 오늘 보상은 없어요.
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTodayRewards.map((obtainedReward) => {
                    const style =
                      REWARD_RARITY_STYLES[obtainedReward.reward.rarity];
                    const isSelected =
                      selectedTodayReward?.id === obtainedReward.id;

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
                          setSelectedTodayId(obtainedReward.id);
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
                            {
                              REWARD_RARITY_LABELS[
                                obtainedReward.reward.rarity
                              ]
                            }
                          </span>
                          {obtainedReward.isNew && (
                            <span className="rounded-full bg-pop px-2 py-0.5 text-xs font-bold text-white">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="font-bold">
                          {obtainedReward.reward.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {obtainedReward.reward.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCatalogRewards.map((reward) => {
                  const isCollected = collectedIds.has(reward.id);
                  const isSelected = selectedCatalogReward?.id === reward.id;
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
                        setSelectedCatalogId(reward.id);
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
