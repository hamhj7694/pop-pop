import { useState } from 'react';
import { BubbleBoard } from './BubbleBoard';
import { useBubbleStore } from '../../domains/bubble/bubble.store';
import { useComboStore } from '../../domains/combo/combo.store';
import { useFeverStore } from '../../domains/fever/fever.store';
import { REWARD_RARITIES } from '../../domains/reward/reward.constants';
import { useSettingsStore } from '../../domains/settings/settings.store';
import { getBubbleTheme } from '../../domains/theme/theme.constants';
import { CollectionOverlay } from '../collection/CollectionOverlay';
import { ComboFeedback } from '../combo/ComboFeedback';
import { RewardDropLayer } from '../reward/RewardDropLayer';
import { RewardRevealToast } from '../reward/RewardRevealToast';
import { TodayFindsButton } from '../reward/TodayFindsButton';
import { SettingsPanel } from '../settings/SettingsPanel';

export function PlayScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const poppedCount = useBubbleStore((state) => state.poppedCount);
  const currentCombo = useComboStore((state) => state.currentCombo);
  const maxCombo = useComboStore((state) => state.maxCombo);
  const isFeverActive = useFeverStore((state) => state.isFeverActive);
  const remainingFeverSeconds = useFeverStore((state) => state.remainingSeconds);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const effectIntensity = useSettingsStore((state) => state.effectIntensity);
  const selectedThemeId = useSettingsStore((state) => state.selectedThemeId);
  const theme = getBubbleTheme(selectedThemeId);

  return (
    <main
      className="min-h-screen text-ink transition-colors duration-300"
      style={{
        backgroundColor: isFeverActive
          ? theme.colors.feverAppBackground
          : theme.colors.appBackground,
        color: theme.colors.appText,
      }}
    >
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-pop">TOKTOK</p>
            <h1 className="text-2xl font-bold sm:text-3xl">뽁뽁 플레이</h1>
          </div>
          <button
            type="button"
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink shadow-sm"
            aria-expanded={isSettingsOpen}
            aria-controls="settings-panel"
            onClick={() => setIsSettingsOpen((current) => !current)}
          >
            설정
          </button>
        </header>

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
        <RewardDropLayer />
        <div className="pointer-events-none fixed left-1/2 top-20 z-20 flex w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2">
          <ComboFeedback />
          <RewardRevealToast />
        </div>

        <BubbleBoard />

        <footer className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm">
            Combo {currentCombo}
          </div>
          <div className="hidden rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm sm:block">
            Best {maxCombo}
          </div>
          {isFeverActive && (
            <div className="rounded-md bg-amber-100 px-3 py-2 text-sm font-black text-amber-900 shadow-sm">
              피버타임 {remainingFeverSeconds}s
            </div>
          )}
          <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm">
            Session {poppedCount}
          </div>
          <TodayFindsButton onClick={() => setIsCollectionOpen(true)} />
        </footer>

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
