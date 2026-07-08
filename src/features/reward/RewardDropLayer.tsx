import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRewardStore } from '../../domains/reward/reward.store';
import { useSettingsStore } from '../../domains/settings/settings.store';
import { getBubbleTheme } from '../../domains/theme/theme.constants';

function getDropIdFromPoint(clientX: number, clientY: number) {
  const elements = document.elementsFromPoint(clientX, clientY);

  for (const element of elements) {
    const dropElement = element.closest<HTMLElement>('[data-reward-drop-id]');

    if (dropElement?.dataset.rewardDropId) {
      return dropElement.dataset.rewardDropId;
    }
  }

  return null;
}

export function RewardDropLayer() {
  const [isCollecting, setIsCollecting] = useState(false);
  const collectedDropIds = useRef(new Set<string>());
  const activeDrops = useRewardStore((state) => state.activeDrops);
  const claimDrop = useRewardStore((state) => state.claimDrop);
  const selectedThemeId = useSettingsStore((state) => state.selectedThemeId);
  const theme = getBubbleTheme(selectedThemeId);

  const claimDropOnce = (dropId: string | null) => {
    if (!dropId || collectedDropIds.current.has(dropId)) {
      return;
    }

    collectedDropIds.current.add(dropId);
    claimDrop(dropId);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const dropId = (event.target as Element)
      .closest<HTMLElement>('[data-reward-drop-id]')
      ?.dataset.rewardDropId;

    if (!dropId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsCollecting(true);
    collectedDropIds.current.clear();
    claimDropOnce(dropId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isCollecting) {
      return;
    }

    event.preventDefault();
    claimDropOnce(getDropIdFromPoint(event.clientX, event.clientY));
  };

  const stopCollecting = () => {
    setIsCollecting(false);
    collectedDropIds.current.clear();
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopCollecting}
      onPointerCancel={stopCollecting}
    >
      <AnimatePresence>
        {activeDrops.map((drop, index) => {
          const scale = 0.92 + (index % 5) * 0.025;

          return (
            <motion.button
              key={drop.id}
              type="button"
              data-reward-drop-id={drop.id}
              className={[
                'pointer-events-auto absolute grid h-12 w-12 touch-none place-items-center rounded-md border text-[11px] font-black shadow-lg',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pop focus-visible:ring-offset-2',
              ].join(' ')}
              style={{
                left: drop.x,
                top: drop.y,
                backgroundColor: theme.colors.boxBackground,
                borderColor: theme.colors.boxBorder,
                color: theme.colors.boxText,
              }}
              initial={{ opacity: 0, scale: 0.72, x: '-50%', y: '-50%' }}
              animate={{
                opacity: 1,
                scale,
                left: `${drop.floorX}%`,
                top: `calc(100vh - ${drop.floorBottom}px)`,
                rotate: drop.rotation,
              }}
              exit={{ opacity: 0, scale: 0.84, y: 10 }}
              transition={{ duration: 0.86, ease: 'easeOut' }}
              aria-label="상자 열기 또는 드래그로 줍기"
              onClick={() => claimDrop(drop.id)}
            >
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded border border-amber-400 bg-white/75 leading-none shadow-inner"
                style={{ borderColor: theme.colors.boxBorder }}
              >
                BOX
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
