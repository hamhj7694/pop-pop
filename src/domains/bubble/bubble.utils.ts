import {
  BUBBLE_GAP,
  MAX_BUBBLES,
  MIN_BUBBLE_SIZE,
  MIN_COLUMNS,
  MIN_ROWS,
} from './bubble.constants';
import type { Bubble, BubbleLayout } from './bubble.types';

export function createBubbles(count: number, boardVersion: number): Bubble[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `bubble-${boardVersion}-${index}`,
    status: 'ready',
  }));
}

export function calculateBubbleLayout(width: number, height: number): BubbleLayout {
  const usableWidth = Math.max(width, MIN_BUBBLE_SIZE * MIN_COLUMNS);
  const usableHeight = Math.max(height, MIN_BUBBLE_SIZE * MIN_ROWS);
  const columns = Math.max(
    MIN_COLUMNS,
    Math.floor((usableWidth + BUBBLE_GAP) / (MIN_BUBBLE_SIZE + BUBBLE_GAP)),
  );
  const rows = Math.max(
    MIN_ROWS,
    Math.floor((usableHeight + BUBBLE_GAP) / (MIN_BUBBLE_SIZE + BUBBLE_GAP)),
  );
  const count = Math.min(columns * rows, MAX_BUBBLES);

  return {
    columns,
    rows: Math.ceil(count / columns),
    count,
  };
}
