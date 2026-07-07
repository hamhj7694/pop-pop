import { useState } from 'react';
import { BubbleBoard } from './BubbleBoard';
import { useBubbleStore } from '../../domains/bubble/bubble.store';
import { useCollectionStore } from '../../domains/collection/collection.store';
import { useComboStore } from '../../domains/combo/combo.store';
import { useFeverStore } from '../../domains/fever/fever.store';
import { REWARD_RARITIES } from '../../domains/reward/reward.constants';
import { useSettingsStore } from '../../domains/settings/settings.store';
import { CollectionOverlay } from '../collection/CollectionOverlay';
import { ComboFeedback } from '../combo/ComboFeedback';
import { RewardDropLayer } from '../reward/RewardDropLayer';
import { RewardRevealToast } from '../reward/RewardRevealToast';
import { TodayFindsButton } from '../reward/TodayFindsButton';
import { TodayFindsOverlay } from '../reward/TodayFindsOverlay';
import { SettingsPanel } from '../settings/SettingsPanel';

export function PlayScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTodayFindsOpen, setIsTodayFindsOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const poppedCount = useBubbleStore((state) => state.poppedCount);
  const collectionCount = useCollectionStore(
    (state) => Object.keys(state.collectedRewards).length,
  );
  const currentCombo = useComboStore((state) => state.currentCombo);
  const maxCombo = useComboStore((state) => state.maxCombo);
  const isFeverActive = useFeverStore((state) => state.isFeverActive);
  const remainingFeverSeconds = useFeverStore((state) => state.remainingSeconds);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const effectIntensity = useSettingsStore((state) => state.effectIntensity);

  return (
    <main
      className={[
        'min-h-screen text-ink transition-colors duration-300',
        isFeverActive ? 'bg-[#fff8e8]' : 'bg-[#f7fbff]',
      ].join(' ')}
    >
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-pop">TOKTOK</p>
            <h1 className="text-2xl font-bold sm:text-3xl">뽁뽁 플레이</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm"
              aria-expanded={isCollectionOpen}
              onClick={() => setIsCollectionOpen((current) => !current)}
            >
              도감 {collectionCount}
            </button>
            <button
              type="button"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm"
              aria-expanded={isSettingsOpen}
              onClick={() => setIsSettingsOpen((current) => !current)}
            >
              설정
            </button>
          </div>
        </header>

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
        <RewardDropLayer />
        <RewardRevealToast />
        <ComboFeedback />

        <BubbleBoard />

        <footer className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">
            Combo {currentCombo}
          </div>
          <div className="hidden rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm sm:block">
            Best {maxCombo}
          </div>
          {isFeverActive && (
            <div className="rounded-md bg-amber-100 px-3 py-2 text-sm font-black text-amber-900 shadow-sm">
              피버타임 {remainingFeverSeconds}s
            </div>
          )}
          <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">
            Session {poppedCount}
          </div>
          <TodayFindsButton onClick={() => setIsTodayFindsOpen(true)} />
        </footer>

        <TodayFindsOverlay
          isOpen={isTodayFindsOpen}
          onClose={() => setIsTodayFindsOpen(false)}
        />
        <CollectionOverlay
          isOpen={isCollectionOpen}
          onClose={() => setIsCollectionOpen(false)}
        />

        <aside className="sr-only">
          현재 설정: 사운드 {soundEnabled ? 'ON' : 'OFF'}, 진동{' '}
          {vibrationEnabled ? 'ON' : 'OFF'}, 이펙트 {effectIntensity}, 보상
          등급 {REWARD_RARITIES.join(', ')}
        </aside>
      </section>
    </main>
  );
}
