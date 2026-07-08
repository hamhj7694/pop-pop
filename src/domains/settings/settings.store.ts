import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { INITIAL_SETTINGS } from './settings.constants';
import type { EffectIntensity, UserSettings } from './settings.types';

interface SettingsState extends UserSettings {
  setSoundEnabled: (soundEnabled: boolean) => void;
  setVibrationEnabled: (vibrationEnabled: boolean) => void;
  setVolume: (volume: number) => void;
  setEffectIntensity: (effectIntensity: EffectIntensity) => void;
  setSelectedThemeId: (selectedThemeId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...INITIAL_SETTINGS,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVibrationEnabled: (vibrationEnabled) => set({ vibrationEnabled }),
      setVolume: (volume) => set({ volume }),
      setEffectIntensity: (effectIntensity) => set({ effectIntensity }),
      setSelectedThemeId: (selectedThemeId) => set({ selectedThemeId }),
    }),
    {
      name: 'toktok-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: ({
        soundEnabled,
        vibrationEnabled,
        volume,
        effectIntensity,
        selectedThemeId,
        selectedEffectId,
        selectedSoundPackId,
      }) => ({
        soundEnabled,
        vibrationEnabled,
        volume,
        effectIntensity,
        selectedThemeId,
        selectedEffectId,
        selectedSoundPackId,
      }),
    },
  ),
);
