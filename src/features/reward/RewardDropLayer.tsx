import { AnimatePresence, motion } from 'framer-motion';
import { REWARD_RARITY_LABELS, REWARD_RARITY_STYLES } from '../../domains/reward/reward.constants';
import { useRewardStore } from '../../domains/reward/reward.store';

export function RewardDropLayer() {
  const activeDrops = useRewardStore((state) => state.activeDrops);
  const dismissDrop = useRewardStore((state) => state.dismissDrop);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <AnimatePresence>
        {activeDrops.map((drop, index) => {
          const style = REWARD_RARITY_STYLES[drop.reward.rarity];

          return (
            <motion.div
              key={drop.id}
              className={[
                'absolute flex min-w-24 items-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-bold shadow-lg',
                style.chip,
              ].join(' ')}
              style={{ left: drop.x, top: drop.y }}
              initial={{ opacity: 0, scale: 0.7, x: '-50%', y: '-50%' }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.7, 1, 0.96, 0.88],
                left: 56 + index * 18,
                top: 'calc(100vh - 5.5rem)',
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.55, ease: 'easeOut' }}
              onAnimationComplete={() => dismissDrop(drop.id)}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/80 text-[11px]">
                {style.symbol}
              </span>
              <span className="max-w-32 truncate">{drop.reward.title}</span>
              <span className="sr-only">
                {REWARD_RARITY_LABELS[drop.reward.rarity]} 보상
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
