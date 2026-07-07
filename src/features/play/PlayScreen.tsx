import { useState } from 'react';
import { BubbleBoard } from './BubbleBoard';
import { useBubbleStore } from '../../domains/bubble/bubble.store';
import { REWARD_RARITIES } from '../../domains/reward/reward.constants';
import { useSettingsStore } from '../../domains/settings/settings.store';
import { SettingsPanel } from '../settings/SettingsPanel';

export function PlayScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const poppedCount = useBubbleStore((state) => state.poppedCount);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const effectIntensity = useSettingsStore((state) => state.effectIntensity);

  return (
    <main className="min-h-screen bg-[#f7fbff] text-ink">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-pop">TOKTOK</p>
            <h1 className="text-2xl font-bold sm:text-3xl">톡톡 플레이</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm"
            >
              도감
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

        <BubbleBoard />

        <footer className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">
            Combo 0
          </div>
          <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">
            Popped {poppedCount}
          </div>
          <button className="h-11 rounded-md bg-ink px-4 text-sm font-bold text-white shadow-sm">
            오늘 주운 것들 0개
          </button>
        </footer>

        <aside className="sr-only">
          현재 설정: 사운드 {soundEnabled ? 'ON' : 'OFF'}, 진동{' '}
          {vibrationEnabled ? 'ON' : 'OFF'}, 이펙트 {effectIntensity}, 보상
          등급 {REWARD_RARITIES.join(', ')}
        </aside>
      </section>
    </main>
  );
}
