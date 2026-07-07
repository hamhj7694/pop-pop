import { HAPTIC_PATTERNS } from './haptics.constants';

type HapticPattern = number | readonly number[];

function vibrate(pattern: HapticPattern) {
  if (!('vibrate' in navigator)) {
    return;
  }

  const vibratePattern: VibratePattern =
    typeof pattern === 'number' ? pattern : [...pattern];

  navigator.vibrate(vibratePattern);
}

export function vibrateBubblePop() {
  vibrate(HAPTIC_PATTERNS.bubble);
}

export function vibrateRareReward() {
  vibrate(HAPTIC_PATTERNS.rareReward);
}

export function vibrateSuperRareReward() {
  vibrate(HAPTIC_PATTERNS.superRareReward);
}

export function vibrateFeverStart() {
  vibrate(HAPTIC_PATTERNS.feverStart);
}
