import { create } from 'zustand';
import { BUBBLE_RESPAWN_DELAY_MS } from './bubble.constants';
import type { Bubble } from './bubble.types';
import { createBubbles } from './bubble.utils';

interface BubbleState {
  bubbles: Bubble[];
  boardVersion: number;
  poppedCount: number;
  initializeBoard: (count: number) => void;
  popBubble: (bubbleId: string) => void;
  respawnBubble: (bubbleId: string) => void;
  resetBoard: (count?: number) => void;
}

export const useBubbleStore = create<BubbleState>((set, get) => ({
  bubbles: [],
  boardVersion: 0,
  poppedCount: 0,
  initializeBoard: (count) => {
    const { bubbles } = get();

    if (bubbles.length === count && bubbles.length > 0) {
      return;
    }

    set((state) => {
      const nextVersion = state.boardVersion + 1;

      return {
        boardVersion: nextVersion,
        bubbles: createBubbles(count, nextVersion),
        poppedCount: 0,
      };
    });
  },
  popBubble: (bubbleId) => {
    const { bubbles } = get();
    const target = bubbles.find((bubble) => bubble.id === bubbleId);

    if (!target || target.status === 'popped') {
      return;
    }

    set((state) => {
      const nextBubbles: Bubble[] = state.bubbles.map((bubble) =>
        bubble.id === bubbleId ? { ...bubble, status: 'popped' } : bubble,
      );

      return {
        bubbles: nextBubbles,
        poppedCount: state.poppedCount + 1,
      };
    });

    window.setTimeout(() => {
      get().respawnBubble(bubbleId);
    }, BUBBLE_RESPAWN_DELAY_MS);
  },
  respawnBubble: (bubbleId) => {
    set((state) => {
      return {
        bubbles: state.bubbles.map((bubble) =>
          bubble.id === bubbleId && bubble.status === 'popped'
            ? { ...bubble, status: 'ready' }
            : bubble,
        ),
      };
    });
  },
  resetBoard: (count) => {
    set((state) => {
      const nextVersion = state.boardVersion + 1;
      const nextCount = count ?? state.bubbles.length;

      return {
        boardVersion: nextVersion,
        bubbles: createBubbles(nextCount, nextVersion),
        poppedCount: 0,
      };
    });
  },
}));
