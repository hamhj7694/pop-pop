import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PointerEvent } from 'react';
import { BUBBLE_GAP } from '../../domains/bubble/bubble.constants';
import { useBubbleStore } from '../../domains/bubble/bubble.store';
import { calculateBubbleLayout } from '../../domains/bubble/bubble.utils';
import { useElementSize } from '../../shared/hooks/useElementSize';

function getBubbleIdFromPoint(clientX: number, clientY: number): string | null {
  const element = document.elementFromPoint(clientX, clientY);
  const bubbleElement = element?.closest<HTMLElement>('[data-bubble-id]');

  return bubbleElement?.dataset.bubbleId ?? null;
}

export function BubbleBoard() {
  const [boardElement, setBoardElement] = useState<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const size = useElementSize(boardElement);
  const bubbles = useBubbleStore((state) => state.bubbles);
  const poppedCount = useBubbleStore((state) => state.poppedCount);
  const initializeBoard = useBubbleStore((state) => state.initializeBoard);
  const popBubble = useBubbleStore((state) => state.popBubble);
  const layout = useMemo(
    () => calculateBubbleLayout(size.width, size.height),
    [size.width, size.height],
  );

  useEffect(() => {
    if (size.width === 0 || size.height === 0) {
      return;
    }

    initializeBoard(layout.count);
  }, [initializeBoard, layout.count, size.height, size.width]);

  useEffect(() => {
    const stopDragging = () => setIsDragging(false);

    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, []);

  const handlePointerDown = (bubbleId: string) => {
    setIsDragging(true);
    popBubble(bubbleId);
  };

  const setBoardRef = useCallback((element: HTMLDivElement | null) => {
    setBoardElement(element);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const bubbleId = getBubbleIdFromPoint(event.clientX, event.clientY);

    if (bubbleId) {
      popBubble(bubbleId);
    }
  };

  return (
    <section
      ref={setBoardRef}
      className="mt-5 grid min-h-[420px] flex-1 select-none place-items-center overflow-hidden rounded-lg border border-sky-100 bg-white/80 p-3 shadow-sm sm:min-h-[520px] sm:p-5"
      onPointerMove={handlePointerMove}
      aria-label="뽁뽁이 플레이 영역"
    >
      <div
        className="grid w-full max-w-5xl"
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
          gap: BUBBLE_GAP,
        }}
      >
        {bubbles.map((bubble, index) => {
          const isPopped = bubble.status === 'popped';

          return (
            <button
              key={bubble.id}
              type="button"
              data-bubble-id={bubble.id}
              className={[
                'relative aspect-square min-h-11 rounded-full border transition duration-150',
                'shadow-[inset_0_6px_14px_rgba(255,255,255,0.9),0_8px_18px_rgba(59,130,246,0.12)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pop focus-visible:ring-offset-2',
                isPopped
                  ? 'scale-75 border-slate-100 bg-slate-100 opacity-35 shadow-none'
                  : 'border-sky-100 bg-bubble hover:scale-95 active:scale-90',
              ].join(' ')}
              disabled={isPopped}
              aria-label={`뽁뽁이 ${index + 1}`}
              aria-pressed={isPopped}
              onPointerDown={() => handlePointerDown(bubble.id)}
              onPointerEnter={() => {
                if (isDragging) {
                  popBubble(bubble.id);
                }
              }}
            >
              {!isPopped && (
                <span className="absolute left-[24%] top-[18%] h-[24%] w-[34%] rounded-full bg-white/70 blur-[1px]" />
              )}
            </button>
          );
        })}
      </div>
      <p className="sr-only">
        현재 판에서 {poppedCount}개의 뽁뽁이를 터뜨렸습니다.
      </p>
    </section>
  );
}
