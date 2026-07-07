export type BubbleStatus = 'ready' | 'popped';

export interface Bubble {
  id: string;
  status: BubbleStatus;
}

export interface BubbleLayout {
  columns: number;
  rows: number;
  count: number;
}
