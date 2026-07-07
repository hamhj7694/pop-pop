import type { UserSettings } from './settings.types';

export const INITIAL_SETTINGS: UserSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  volume: 0.7,
  effectIntensity: 'normal',
  selectedThemeId: 'default',
  selectedEffectId: 'default',
  selectedSoundPackId: 'default',
};
