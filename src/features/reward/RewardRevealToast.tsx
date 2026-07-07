import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRewardStore } from '../../domains/reward/reward.store';

export function RewardRevealToast() {
  const revealedReward = useRewardStore((state) => state.revealedReward);
  const boxEffect = useRewardStore((state) => state.boxEffect);
  const clearRevealedReward = useRewardStore(
    (state) => state.clearRevealedReward,
  );
  const clearBoxEffect = useRewardStore((state) => state.clearBoxEffect);

  useEffect(() => {
    if (!revealedReward) {
      return;
    }

    const timerId = window.setTimeout(clearRevealedReward, 2400);

    return () => window.clearTimeout(timerId);
  }, [clearRevealedReward, revealedReward]);

  useEffect(() => {
    if (!boxEffect) {
      return;
    }

    const timerId = window.setTimeout(clearBoxEffect, 2200);

    return () => window.clearTimeout(timerId);
  }, [boxEffect, clearBoxEffect]);

  return (
    <>
      <AnimatePresence>
        {revealedReward && (
          <motion.div
            className="pointer-events-none fixed left-1/2 top-4 z-40 w-[min(92vw,30rem)] -translate-x-1/2 rounded-md border border-pop bg-white px-4 py-3 text-center shadow-xl"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
          >
            <p className="text-xs font-bold text-pop">보상 발견</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {revealedReward.reward.contentText ?? revealedReward.reward.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {boxEffect && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 grid place-items-center bg-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={[
                'rounded-lg border bg-white px-6 py-5 text-center shadow-2xl',
                boxEffect.type === 'fever_start'
                  ? 'border-amber-300 text-amber-900'
                  : 'border-pop text-ink',
              ].join(' ')}
              initial={{ scale: 0.72, rotate: -2 }}
              animate={{ scale: [0.72, 1.08, 1], rotate: [-2, 2, 0] }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.48, ease: 'easeOut' }}
            >
              <p className="text-2xl font-black">{boxEffect.label}</p>
              <p className="mt-2 text-sm font-bold">{boxEffect.message}</p>
            </motion.div>

            {boxEffect.type === 'big_particles' && (
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 18 }, (_, index) => (
                  <motion.span
                    key={index}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-pop"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos((Math.PI * 2 * index) / 18) * 180,
                      y: Math.sin((Math.PI * 2 * index) / 18) * 180,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
