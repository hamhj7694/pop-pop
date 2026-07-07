import { AnimatePresence, motion } from 'framer-motion';
import { useRewardStore } from '../../domains/reward/reward.store';

export function RewardDropLayer() {
  const activeDrops = useRewardStore((state) => state.activeDrops);
  const claimDrop = useRewardStore((state) => state.claimDrop);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <AnimatePresence>
        {activeDrops.map((drop, index) => {
          const scale = 0.92 + (index % 5) * 0.025;

          return (
            <motion.button
              key={drop.id}
              type="button"
              className={[
                'pointer-events-auto absolute grid h-12 w-12 place-items-center rounded-md border border-amber-300 bg-amber-50 text-[11px] font-black text-amber-950 shadow-lg',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-pop focus-visible:ring-offset-2',
              ].join(' ')}
              style={{ left: drop.x, top: drop.y }}
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
              aria-label="상자 열기"
              onClick={() => claimDrop(drop.id)}
            >
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded border border-amber-400 bg-white/75 leading-none shadow-inner"
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
