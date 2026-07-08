import { useEffect } from 'react';
import type { EffectIntensity } from '../../domains/settings/settings.types';
import { useSettingsStore } from '../../domains/settings/settings.store';
import {
  BUBBLE_THEMES,
  getBubbleTheme,
} from '../../domains/theme/theme.constants';

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
  const selectedThemeId = useSettingsStore((state) => state.selectedThemeId);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const setVibrationEnabled = useSettingsStore(
    (state) => state.setVibrationEnabled,
  );
  const setVolume = useSettingsStore((state) => state.setVolume);
  const setEffectIntensity = useSettingsStore(
    (state) => state.setEffectIntensity,
  );
  const setSelectedThemeId = useSettingsStore(
    (state) => state.setSelectedThemeId,
  );
  const activeThemeId = getBubbleTheme(selectedThemeId).id;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      id="settings-panel"
      className="absolute right-4 top-20 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-xl"
      role="dialog"
      aria-modal="false"
      aria-labelledby="settings-title"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="settings-title" className="text-lg font-bold">
          설정
        </h2>
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

        <fieldset className="rounded-md border border-slate-100 p-3">
          <legend className="px-1 font-semibold">뽁뽁이 테마</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {BUBBLE_THEMES.map((theme) => (
              <label
                key={theme.id}
                className={[
                  'cursor-pointer rounded-md border p-2 transition',
                  activeThemeId === theme.id
                    ? 'border-pop bg-pink-50 text-ink'
                    : 'border-slate-200 bg-white text-slate-600',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="selectedThemeId"
                  className="sr-only"
                  checked={activeThemeId === theme.id}
                  onChange={() => setSelectedThemeId(theme.id)}
                />
                <span className="block text-sm font-bold">{theme.name}</span>
                <span className="mt-2 flex gap-1" aria-hidden="true">
                  {theme.swatches.map((swatch) => (
                    <span
                      key={swatch}
                      className="h-5 flex-1 rounded-sm border border-black/10"
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
