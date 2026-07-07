export interface UserSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  volume: number;
  effectIntensity: 'low' | 'normal' | 'high';
  selectedThemeId: string;
  selectedEffectId: string;
  selectedSoundPackId: string;
}
