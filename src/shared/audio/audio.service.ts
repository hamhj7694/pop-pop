import { Howl, Howler } from 'howler';
import { createPopSoundDataUri } from './popSoundDataUri';

const POP_SOUND_CONFIGS = [
  { frequency: 520, duration: 0.075 },
  { frequency: 610, duration: 0.068 },
  { frequency: 710, duration: 0.06 },
  { frequency: 460, duration: 0.082 },
];

const MIN_PLAY_INTERVAL_MS = 34;
let popSounds: Howl[] | null = null;
let lastPlayedAt = 0;

function getPopSounds() {
  if (!popSounds) {
    popSounds = POP_SOUND_CONFIGS.map(
      (config) =>
        new Howl({
          src: [createPopSoundDataUri(config)],
          html5: false,
          preload: true,
        }),
    );
  }

  return popSounds;
}

export function playBubblePopSound(volume: number) {
  const now = performance.now();

  if (now - lastPlayedAt < MIN_PLAY_INTERVAL_MS) {
    return;
  }

  lastPlayedAt = now;
  Howler.volume(Math.max(0, Math.min(1, volume)));

  const sounds = getPopSounds();
  const sound = sounds[Math.floor(Math.random() * sounds.length)];

  sound.play();
}
