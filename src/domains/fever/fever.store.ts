import { create } from 'zustand';
import {
  FEVER_BASE_CHANCE,
  FEVER_COMBO_BONUS_CHANCE,
  FEVER_COMBO_BONUS_THRESHOLD,
  FEVER_DURATION_MS,
} from './fever.constants';

interface FeverState {
  isFeverActive: boolean;
  feverEndsAt: number | null;
  remainingSeconds: number;
  feverCount: number;
  tryStartFever: (combo: number) => boolean;
  startFever: () => void;
  endFever: () => void;
}

let feverTimerId: number | null = null;

function clearFeverTimer() {
  if (feverTimerId === null) {
    return;
  }

  window.clearInterval(feverTimerId);
  feverTimerId = null;
}

export const useFeverStore = create<FeverState>((set, get) => ({
  isFeverActive: false,
  feverEndsAt: null,
  remainingSeconds: 0,
  feverCount: 0,
  tryStartFever: (combo) => {
    if (get().isFeverActive) {
      return false;
    }

    const chance =
      FEVER_BASE_CHANCE +
      (combo >= FEVER_COMBO_BONUS_THRESHOLD ? FEVER_COMBO_BONUS_CHANCE : 0);

    if (Math.random() > chance) {
      return false;
    }

    get().startFever();

    return true;
  },
  startFever: () => {
    const feverEndsAt = Date.now() + FEVER_DURATION_MS;

    clearFeverTimer();
    set((state) => ({
      isFeverActive: true,
      feverEndsAt,
      remainingSeconds: Math.ceil(FEVER_DURATION_MS / 1000),
      feverCount: state.feverCount + 1,
    }));

    feverTimerId = window.setInterval(() => {
      const remainingMs = Math.max(0, feverEndsAt - Date.now());

      if (remainingMs === 0) {
        get().endFever();
        return;
      }

      set({ remainingSeconds: Math.ceil(remainingMs / 1000) });
    }, 250);
  },
  endFever: () => {
    clearFeverTimer();
    set({
      isFeverActive: false,
      feverEndsAt: null,
      remainingSeconds: 0,
    });
  },
}));
