import { INITIAL_SETTINGS } from '../domains/settings/settings.constants';
import { REWARD_RARITIES } from '../domains/reward/reward.constants';

export function App() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-pop">TOKTOK</p>
            <h1 className="text-2xl font-bold sm:text-3xl">톡톡 플레이</h1>
          </div>
          <div className="flex gap-2">
            <button className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm">
              도감
            </button>
            <button className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold shadow-sm">
              설정
            </button>
          </div>
        </header>

        <section className="mt-5 grid flex-1 place-items-center rounded-lg border border-sky-100 bg-white/80 p-4 shadow-sm">
          <div className="grid w-full max-w-3xl grid-cols-5 gap-3 sm:grid-cols-8 sm:gap-4">
            {Array.from({ length: 40 }, (_, index) => (
              <button
                key={index}
                className="aspect-square rounded-full border border-sky-100 bg-bubble shadow-[inset_0_6px_14px_rgba(255,255,255,0.9),0_8px_18px_rgba(59,130,246,0.12)] transition hover:scale-95 active:scale-90"
                aria-label={`뽁뽁이 ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <footer className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm">
            Combo 0
          </div>
          <button className="h-11 rounded-md bg-ink px-4 text-sm font-bold text-white shadow-sm">
            오늘 주운 것들 0개
          </button>
        </footer>

        <aside className="sr-only">
          기본 설정: 사운드 {INITIAL_SETTINGS.soundEnabled ? 'ON' : 'OFF'},
          진동 {INITIAL_SETTINGS.vibrationEnabled ? 'ON' : 'OFF'}, 보상 등급{' '}
          {REWARD_RARITIES.join(', ')}
        </aside>
      </section>
    </main>
  );
}
