export type EffectIntensity = 'low' | 'normal' | 'high';

export interface UserSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  volume: number;
  effectIntensity: EffectIntensity;
  selectedThemeId: string;
  selectedEffectId: string;
  selectedSoundPackId: string;
}
