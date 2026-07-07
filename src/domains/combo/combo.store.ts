import { create } from 'zustand';
import { COMBO_TIMEOUT_MS, isComboMilestone } from './combo.constants';

interface ComboState {
  currentCombo: number;
  maxCombo: number;
  lastReachedMilestone: number | null;
  lastEndedCombo: number | null;
  incrementCombo: () => number;
  endCombo: () => void;
  clearReachedMilestone: () => void;
  clearEndedCombo: () => void;
}

let comboEndTimer: number | null = null;

function scheduleComboEnd(endCombo: () => void) {
  if (comboEndTimer !== null) {
    window.clearTimeout(comboEndTimer);
  }

  comboEndTimer = window.setTimeout(() => {
    comboEndTimer = null;
    endCombo();
  }, COMBO_TIMEOUT_MS);
}

export const useComboStore = create<ComboState>((set, get) => ({
  currentCombo: 0,
  maxCombo: 0,
  lastReachedMilestone: null,
  lastEndedCombo: null,
  incrementCombo: () => {
    let nextCombo = 0;

    set((state) => {
      nextCombo = state.currentCombo + 1;

      return {
        currentCombo: nextCombo,
        maxCombo: Math.max(state.maxCombo, nextCombo),
        lastReachedMilestone: isComboMilestone(nextCombo)
          ? nextCombo
          : state.lastReachedMilestone,
      };
    });

    scheduleComboEnd(get().endCombo);

    return nextCombo;
  },
  endCombo: () => {
    const currentCombo = get().currentCombo;

    if (currentCombo === 0) {
      return;
    }

    set({
      currentCombo: 0,
      lastEndedCombo: currentCombo >= 10 ? currentCombo : null,
    });
  },
  clearReachedMilestone: () => {
    set({ lastReachedMilestone: null });
  },
  clearEndedCombo: () => {
    set({ lastEndedCombo: null });
  },
}));
