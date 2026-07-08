import type { UserSettings } from './settings.types';
import { DEFAULT_THEME_ID } from '../theme/theme.constants';

export const INITIAL_SETTINGS: UserSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  volume: 0.7,
  effectIntensity: 'normal',
  selectedThemeId: DEFAULT_THEME_ID,
  selectedEffectId: 'default',
  selectedSoundPackId: 'default',
};
