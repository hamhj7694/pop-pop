import { AnimatePresence, motion } from 'framer-motion';
import {
  REWARD_RARITY_LABELS,
  REWARD_RARITY_STYLES,
} from '../../domains/reward/reward.constants';
import { useRewardStore } from '../../domains/reward/reward.store';

const CONTAINER_LABELS = {
  gift: '선물상자',
  card: '카드',
} as const;

export function RewardDropLayer() {
  const activeDrops = useRewardStore((state) => state.activeDrops);
  const claimDrop = useRewardStore((state) => state.claimDrop);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <AnimatePresence>
        {activeDrops.map((drop, index) => {
          const style = REWARD_RARITY_STYLES[drop.reward.rarity];
          const floorLeft = 54 + (index % 7) * 46;
          const floorBottom = 76 + Math.floor(index / 7) * 42;

          return (
            <motion.button
              key={drop.id}
              type="button"
              className={[
                'pointer-events-auto absolute grid h-12 w-12 place-items-center rounded-md border bg-white text-lg font-black shadow-lg',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pop focus-visible:ring-offset-2',
                style.chip,
              ].join(' ')}
              style={{ left: drop.x, top: drop.y }}
              initial={{ opacity: 0, scale: 0.72, x: '-50%', y: '-50%' }}
              animate={{
                opacity: 1,
                scale: 1,
                left: floorLeft,
                top: `calc(100vh - ${floorBottom}px)`,
                rotate: drop.containerType === 'gift' ? [-3, 3, 0] : [2, -2, 0],
              }}
              exit={{ opacity: 0, scale: 0.84, y: 10 }}
              transition={{ duration: 0.82, ease: 'easeOut' }}
              aria-label={`${CONTAINER_LABELS[drop.containerType]} 열기, ${REWARD_RARITY_LABELS[drop.reward.rarity]} 보상`}
              onClick={() => claimDrop(drop.id)}
            >
              <span aria-hidden="true" className="text-[11px] leading-none">
                {drop.containerType === 'gift' ? 'BOX' : 'CARD'}
              </span>
              <span className="sr-only">{drop.reward.title}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
