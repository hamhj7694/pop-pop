import type { EffectIntensity } from '../../domains/settings/settings.types';
import { useSettingsStore } from '../../domains/settings/settings.store';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const EFFECT_OPTIONS: Array<{ label: string; value: EffectIntensity }> = [
  { label: '약하게', value: 'low' },
  { label: '기본', value: 'normal' },
  { label: '풍성하게', value: 'high' },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const volume = useSettingsStore((state) => state.volume);
  const effectIntensity = useSettingsStore((state) => state.effectIntensity);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const setVibrationEnabled = useSettingsStore(
    (state) => state.setVibrationEnabled,
  );
  const setVolume = useSettingsStore((state) => state.setVolume);
  const setEffectIntensity = useSettingsStore(
    (state) => state.setEffectIntensity,
  );

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className="absolute right-4 top-20 z-20 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-xl"
      aria-label="설정"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">설정</h2>
        <button
          type="button"
          className="h-9 rounded-md border border-slate-200 px-3 text-sm font-semibold"
          onClick={onClose}
        >
          닫기
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3">
          <span className="font-semibold">사운드</span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-pop"
            checked={soundEnabled}
            onChange={(event) => setSoundEnabled(event.target.checked)}
          />
        </label>

        <label className="block rounded-md border border-slate-100 p-3">
          <span className="mb-2 flex items-center justify-between gap-3 font-semibold">
            볼륨
            <span className="text-sm text-slate-500">
              {Math.round(volume * 100)}%
            </span>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            className="w-full accent-pop"
            value={volume}
            disabled={!soundEnabled}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3">
          <span className="font-semibold">진동</span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-pop"
            checked={vibrationEnabled}
            onChange={(event) => setVibrationEnabled(event.target.checked)}
          />
        </label>

        <fieldset className="rounded-md border border-slate-100 p-3">
          <legend className="px-1 font-semibold">이펙트 강도</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {EFFECT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={[
                  'flex cursor-pointer items-center justify-center rounded-md border px-2 py-2 text-sm font-semibold',
                  effectIntensity === option.value
                    ? 'border-pop bg-pink-50 text-ink'
                    : 'border-slate-200 bg-white text-slate-600',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="effectIntensity"
                  className="sr-only"
                  checked={effectIntensity === option.value}
                  onChange={() => setEffectIntensity(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
