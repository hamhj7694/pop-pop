import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BUBBLE_GAP } from '../../domains/bubble/bubble.constants';
import { useBubbleStore } from '../../domains/bubble/bubble.store';
import { calculateBubbleLayout } from '../../domains/bubble/bubble.utils';
import { getComboRewardMultiplier } from '../../domains/combo/combo.constants';
import { useComboStore } from '../../domains/combo/combo.store';
import {
  FEVER_EXCLUSIVE_REWARD_CHANCE,
  FEVER_REWARD_MULTIPLIER,
} from '../../domains/fever/fever.constants';
import { useFeverStore } from '../../domains/fever/fever.store';
import { useRewardStore } from '../../domains/reward/reward.store';
import { useSettingsStore } from '../../domains/settings/settings.store';
import { getBubbleTheme } from '../../domains/theme/theme.constants';
import {
  playBubblePopSound,
  playFeverStartSound,
} from '../../shared/audio/audio.service';
import {
  vibrateBubblePop,
  vibrateFeverStart,
  vibrateRareReward,
} from '../../shared/haptics/haptics.service';
import { useElementSize } from '../../shared/hooks/useElementSize';

interface PopBurst {
  id: string;
  left: number;
  top: number;
  particleCount: number;
  distance: number;
  isFever: boolean;
}

interface DelightBurst {
  id: string;
  left: number;
  top: number;
  kind: 'heart' | 'star' | 'fanfare' | 'sparkle';
  isFever: boolean;
}

const EFFECT_PARTICLE_CONFIG = {
  low: { particleCount: 3, distance: 18 },
  normal: { particleCount: 6, distance: 24 },
  high: { particleCount: 9, distance: 30 },
} as const;

const DELIGHT_EFFECTS: Array<DelightBurst['kind']> = [
  'heart',
  'star',
  'fanfare',
  'sparkle',
];

const DELIGHT_TRIGGER_CHANCE = {
  normal: 0.12,
  fever: 0.34,
} as const;

const DELIGHT_EFFECT_SYMBOLS: Record<DelightBurst['kind'], string[]> = {
  heart: ['♥', '♡', '♥'],
  star: ['★', '✦', '★'],
  fanfare: ['POP', 'WOW', 'POP'],
  sparkle: ['✦', '·', '✦'],
};

function getBubbleElementFromPoint(
  clientX: number,
  clientY: number,
): HTMLElement | null {
  const elements = document.elementsFromPoint(clientX, clientY);

  for (const element of elements) {
    const bubbleElement = element.closest<HTMLElement>('[data-bubble-id]');

    if (bubbleElement) {
      return bubbleElement;
    }
  }

  return null;
}

export function BubbleBoard() {
  const [boardElement, setBoardElement] = useState<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bursts, setBursts] = useState<PopBurst[]>([]);
  const [delightBursts, setDelightBursts] = useState<DelightBurst[]>([]);
  const size = useElementSize(boardElement);
  const bubbles = useBubbleStore((state) => state.bubbles);
  const poppedCount = useBubbleStore((state) => state.poppedCount);
  const initializeBoard = useBubbleStore((state) => state.initializeBoard);
  const popBubble = useBubbleStore((state) => state.popBubble);
  const incrementCombo = useComboStore((state) => state.incrementCombo);
  const isFeverActive = useFeverStore((state) => state.isFeverActive);
  const tryStartFever = useFeverStore((state) => state.tryStartFever);
  const tryRewardDrop = useRewardStore((state) => state.tryRewardDrop);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const volume = useSettingsStore((state) => state.volume);
  const effectIntensity = useSettingsStore((state) => state.effectIntensity);
  const selectedThemeId = useSettingsStore((state) => state.selectedThemeId);
  const theme = getBubbleTheme(selectedThemeId);
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
          isFever: useFeverStore.getState().isFeverActive,
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

  const maybeSpawnDelightBurst = useCallback(
    (bubbleElement: HTMLElement, isCurrentFeverActive: boolean) => {
      if (!boardElement) {
        return;
      }

      const chance = isCurrentFeverActive
        ? DELIGHT_TRIGGER_CHANCE.fever
        : DELIGHT_TRIGGER_CHANCE.normal;

      if (Math.random() > chance) {
        return;
      }

      const boardRect = boardElement.getBoundingClientRect();
      const bubbleRect = bubbleElement.getBoundingClientRect();
      const left = bubbleRect.left - boardRect.left + bubbleRect.width / 2;
      const top = bubbleRect.top - boardRect.top + bubbleRect.height / 2;
      const kind =
        DELIGHT_EFFECTS[Math.floor(Math.random() * DELIGHT_EFFECTS.length)];
      const id = `delight-${bubbleElement.dataset.bubbleId}-${Date.now()}`;

      setDelightBursts((currentBursts) => [
        ...currentBursts,
        {
          id,
          left,
          top,
          kind,
          isFever: isCurrentFeverActive,
        },
      ]);

      window.setTimeout(() => {
        setDelightBursts((currentBursts) =>
          currentBursts.filter((burst) => burst.id !== id),
        );
      }, 900);
    },
    [boardElement],
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

      popBubble(bubbleId);
      const nextCombo = incrementCombo();
      const feverStarted = tryStartFever(nextCombo);
      const isRewardFeverActive =
        feverStarted || useFeverStore.getState().isFeverActive;

      if (feverStarted && soundEnabled) {
        playFeverStartSound(volume);
      }

      spawnBurst(bubbleElement);
      maybeSpawnDelightBurst(bubbleElement, isRewardFeverActive);

      const bubbleRect = bubbleElement.getBoundingClientRect();
      const rewardDrop = tryRewardDrop({
        x: bubbleRect.left + bubbleRect.width / 2,
        y: bubbleRect.top + bubbleRect.height / 2,
        obtainedSource: isRewardFeverActive ? 'fever' : 'random',
        modifiers: {
          comboMultiplier: getComboRewardMultiplier(nextCombo),
          feverMultiplier: isRewardFeverActive ? FEVER_REWARD_MULTIPLIER : 1,
          feverExclusiveChance: isRewardFeverActive
            ? FEVER_EXCLUSIVE_REWARD_CHANCE
            : 0,
        },
      });

      if (vibrationEnabled) {
        if (feverStarted) {
          vibrateFeverStart();
        } else if (rewardDrop) {
          vibrateRareReward();
        } else {
          vibrateBubblePop();
        }
      }
    },
    [
      popBubble,
      incrementCombo,
      tryStartFever,
      soundEnabled,
      spawnBurst,
      maybeSpawnDelightBurst,
      tryRewardDrop,
      vibrationEnabled,
      volume,
    ],
  );

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    bubbleId: string,
    bubbleElement: HTMLElement,
  ) => {
    setIsDragging(true);
    boardElement?.setPointerCapture(event.pointerId);
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
      className="relative mt-5 grid min-h-[420px] flex-1 touch-none select-none place-items-center overflow-hidden rounded-lg border p-3 shadow-sm transition-colors duration-300 sm:min-h-[520px] sm:p-5"
      style={{
        backgroundColor: isFeverActive
          ? theme.colors.feverBoardBackground
          : theme.colors.boardBackground,
        borderColor: isFeverActive
          ? theme.colors.feverBoardBorder
          : theme.colors.boardBorder,
      }}
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
                    className={[
                      'absolute h-1.5 w-1.5 rounded-full shadow-sm',
                    ].join(' ')}
                    style={{
                      backgroundColor: burst.isFever
                        ? theme.colors.feverParticle
                        : theme.colors.particle,
                    }}
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {delightBursts.map((burst) => (
            <motion.div
              key={burst.id}
              className="absolute"
              style={{ left: burst.left, top: burst.top }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.18, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.84, ease: 'easeOut' }}
            >
              {DELIGHT_EFFECT_SYMBOLS[burst.kind].map((symbol, index) => {
                const direction = index - 1;

                return (
                  <motion.span
                    key={`${symbol}-${index}`}
                    className={[
                      'absolute text-sm font-black drop-shadow-sm',
                    ].join(' ')}
                    style={{
                      color: burst.isFever
                        ? theme.colors.feverParticle
                        : theme.colors.particle,
                    }}
                    initial={{ x: 0, y: 0, rotate: 0 }}
                    animate={{
                      x: direction * 24,
                      y: -34 - index * 8,
                      rotate: direction * 12,
                    }}
                    transition={{ duration: 0.78, ease: 'easeOut' }}
                  >
                    {symbol}
                  </motion.span>
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
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pop focus-visible:ring-offset-2',
                isPopped
                  ? 'scale-75 opacity-35 shadow-none'
                  : 'hover:scale-95 active:scale-90',
              ].join(' ')}
              style={{
                backgroundColor: isPopped
                  ? theme.colors.poppedBackground
                  : isFeverActive
                    ? theme.colors.feverBubbleBackground
                    : theme.colors.bubbleBackground,
                borderColor: isPopped
                  ? theme.colors.poppedBorder
                  : isFeverActive
                    ? theme.colors.feverBubbleBorder
                    : theme.colors.bubbleBorder,
                boxShadow: isPopped ? 'none' : theme.colors.bubbleShadow,
              }}
              disabled={isPopped}
              aria-label={`뽁뽁이 ${index + 1}`}
              aria-pressed={isPopped}
              onPointerDown={(event) =>
                handlePointerDown(event, bubble.id, event.currentTarget)
              }
              onPointerEnter={(event) => {
                if (isDragging && event.currentTarget instanceof HTMLElement) {
                  triggerBubblePop(bubble.id, event.currentTarget);
                }
              }}
            >
              {!isPopped && (
                <span
                  className="absolute left-[22%] top-[16%] h-[25%] w-[36%] rounded-full blur-[1px]"
                  style={{ backgroundColor: theme.colors.bubbleHighlight }}
                />
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
