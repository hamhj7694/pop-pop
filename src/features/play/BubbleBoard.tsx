import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BUBBLE_GAP } from '../../domains/bubble/bubble.constants';
import { useBubbleStore } from '../../domains/bubble/bubble.store';
import { calculateBubbleLayout } from '../../domains/bubble/bubble.utils';
import { useRewardStore } from '../../domains/reward/reward.store';
import { useSettingsStore } from '../../domains/settings/settings.store';
import { playBubblePopSound } from '../../shared/audio/audio.service';
import {
  vibrateBubblePop,
  vibrateRareReward,
  vibrateSuperRareReward,
} from '../../shared/haptics/haptics.service';
import { useElementSize } from '../../shared/hooks/useElementSize';

interface PopBurst {
  id: string;
  left: number;
  top: number;
  particleCount: number;
  distance: number;
}

const EFFECT_PARTICLE_CONFIG = {
  low: { particleCount: 3, distance: 18 },
  normal: { particleCount: 6, distance: 24 },
  high: { particleCount: 9, distance: 30 },
} as const;

function getBubbleElementFromPoint(
  clientX: number,
  clientY: number,
): HTMLElement | null {
  const element = document.elementFromPoint(clientX, clientY);

  return element?.closest<HTMLElement>('[data-bubble-id]') ?? null;
}

export function BubbleBoard() {
  const [boardElement, setBoardElement] = useState<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bursts, setBursts] = useState<PopBurst[]>([]);
  const size = useElementSize(boardElement);
  const bubbles = useBubbleStore((state) => state.bubbles);
  const poppedCount = useBubbleStore((state) => state.poppedCount);
  const initializeBoard = useBubbleStore((state) => state.initializeBoard);
  const popBubble = useBubbleStore((state) => state.popBubble);
  const tryRewardDrop = useRewardStore((state) => state.tryRewardDrop);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const volume = useSettingsStore((state) => state.volume);
  const effectIntensity = useSettingsStore((state) => state.effectIntensity);
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

  const spawnBurst = useCallback(
    (bubbleElement: HTMLElement) => {
      if (!boardElement) {
        return;
      }

      const boardRect = boardElement.getBoundingClientRect();
      const bubbleRect = bubbleElement.getBoundingClientRect();
      const left = bubbleRect.left - boardRect.left + bubbleRect.width / 2;
      const top = bubbleRect.top - boardRect.top + bubbleRect.height / 2;
      const id = `burst-${bubbleElement.dataset.bubbleId}-${Date.now()}`;
      const effectConfig = EFFECT_PARTICLE_CONFIG[effectIntensity];

      setBursts((currentBursts) => [
        ...currentBursts,
        {
          id,
          left,
          top,
          particleCount: effectConfig.particleCount,
          distance: effectConfig.distance,
        },
      ]);
      window.setTimeout(() => {
        setBursts((currentBursts) =>
          currentBursts.filter((burst) => burst.id !== id),
        );
      }, 520);
    },
    [boardElement, effectIntensity],
  );

  const triggerBubblePop = useCallback(
    (bubbleId: string, bubbleElement: HTMLElement) => {
      const bubble = useBubbleStore
        .getState()
        .bubbles.find((currentBubble) => currentBubble.id === bubbleId);

      if (!bubble || bubble.status === 'popped') {
        return;
      }

      if (soundEnabled) {
        playBubblePopSound(volume);
      }

      spawnBurst(bubbleElement);
      popBubble(bubbleId);

      const bubbleRect = bubbleElement.getBoundingClientRect();
      const rewardDrop = tryRewardDrop({
        x: bubbleRect.left + bubbleRect.width / 2,
        y: bubbleRect.top + bubbleRect.height / 2,
        modifiers: {
          comboMultiplier: 1,
          feverMultiplier: 1,
        },
      });

      if (vibrationEnabled) {
        if (rewardDrop?.reward.rarity === 'super_rare') {
          vibrateSuperRareReward();
        } else if (rewardDrop?.reward.rarity === 'rare') {
          vibrateRareReward();
        } else {
          vibrateBubblePop();
        }
      }
    },
    [
      popBubble,
      soundEnabled,
      spawnBurst,
      tryRewardDrop,
      vibrationEnabled,
      volume,
    ],
  );

  const handlePointerDown = (bubbleId: string, bubbleElement: HTMLElement) => {
    setIsDragging(true);
    triggerBubblePop(bubbleId, bubbleElement);
  };

  const setBoardRef = useCallback((element: HTMLDivElement | null) => {
    setBoardElement(element);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    const bubbleElement = getBubbleElementFromPoint(event.clientX, event.clientY);
    const bubbleId = bubbleElement?.dataset.bubbleId;

    if (bubbleId && bubbleElement) {
      triggerBubblePop(bubbleId, bubbleElement);
    }
  };

  return (
    <section
      ref={setBoardRef}
      className="relative mt-5 grid min-h-[420px] flex-1 select-none place-items-center overflow-hidden rounded-lg border border-sky-200 bg-[#eaf7ff] p-3 shadow-sm sm:min-h-[520px] sm:p-5"
      onPointerMove={handlePointerMove}
      aria-label="뽁뽁이 플레이 영역"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {bursts.map((burst) => (
            <motion.div
              key={burst.id}
              className="absolute"
              style={{ left: burst.left, top: burst.top }}
              initial={{ opacity: 1, scale: 0.7 }}
              animate={{ opacity: 0, scale: 1.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.48, ease: 'easeOut' }}
            >
              {Array.from({ length: burst.particleCount }, (_, index) => {
                const angle = (Math.PI * 2 * index) / burst.particleCount;
                const distance = burst.distance + index * 2;

                return (
                  <motion.span
                    key={index}
                    className="absolute h-1.5 w-1.5 rounded-full bg-pop shadow-sm"
                    initial={{ x: 0, y: 0 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                    }}
                    transition={{ duration: 0.42, ease: 'easeOut' }}
                  />
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
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
                'shadow-[inset_0_7px_14px_rgba(255,255,255,0.72),inset_0_-8px_16px_rgba(14,116,144,0.18),0_8px_18px_rgba(8,145,178,0.22)]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pop focus-visible:ring-offset-2',
                isPopped
                  ? 'scale-75 border-slate-200 bg-slate-200 opacity-35 shadow-none'
                  : 'border-cyan-400 bg-[#76d7f2] hover:scale-95 active:scale-90',
              ].join(' ')}
              disabled={isPopped}
              aria-label={`뽁뽁이 ${index + 1}`}
              aria-pressed={isPopped}
              onPointerDown={(event) =>
                handlePointerDown(bubble.id, event.currentTarget)
              }
              onPointerEnter={(event) => {
                if (isDragging && event.currentTarget instanceof HTMLElement) {
                  triggerBubblePop(bubble.id, event.currentTarget);
                }
              }}
            >
              {!isPopped && (
                <span className="absolute left-[22%] top-[16%] h-[25%] w-[36%] rounded-full bg-white/75 blur-[1px]" />
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
