import { create } from 'zustand';
import { COMBO_TIMEOUT_MS } from './combo.constants';

interface ComboState {
  currentCombo: number;
  maxCombo: number;
  incrementCombo: () => number;
  endCombo: () => void;
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
  incrementCombo: () => {
    let nextCombo = 0;

    set((state) => {
      nextCombo = state.currentCombo + 1;

      return {
        currentCombo: nextCombo,
        maxCombo: Math.max(state.maxCombo, nextCombo),
      };
    });

    scheduleComboEnd(get().endCombo);

    return nextCombo;
  },
  endCombo: () => {
    set({ currentCombo: 0 });
  },
}));
