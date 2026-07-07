import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRewardStore } from '../../domains/reward/reward.store';

export function RewardRevealToast() {
  const revealedReward = useRewardStore((state) => state.revealedReward);
  const clearRevealedReward = useRewardStore(
    (state) => state.clearRevealedReward,
  );

  useEffect(() => {
    if (!revealedReward) {
      return;
    }

    const timerId = window.setTimeout(clearRevealedReward, 2400);

    return () => window.clearTimeout(timerId);
  }, [clearRevealedReward, revealedReward]);

  return (
    <AnimatePresence>
      {revealedReward && (
        <motion.div
          className="pointer-events-none fixed left-1/2 top-4 z-40 w-[min(92vw,30rem)] -translate-x-1/2 rounded-md border border-pop bg-white px-4 py-3 text-center shadow-xl"
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
        >
          <p className="text-xs font-bold text-pop">문구 발견</p>
          <p className="mt-1 text-sm font-bold text-ink">
            {revealedReward.reward.contentText ?? revealedReward.reward.title}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
