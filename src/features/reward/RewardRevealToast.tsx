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

  if (!revealedReward && !boxEffect) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {revealedReward && (
          <motion.div
            className="rounded-md border border-pop bg-white px-4 py-3 text-center shadow-lg"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
          >
            <p className="text-sm font-semibold text-pop">보상 발견</p>
            <p className="mt-1 text-lg font-bold text-ink">
              {revealedReward.reward.contentText ?? revealedReward.reward.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {boxEffect && (
          <motion.div
            className={[
              'relative rounded-md border bg-white px-4 py-3 text-center shadow-lg',
              boxEffect.type === 'fever_start'
                ? 'border-amber-300 text-amber-900'
                : 'border-pop text-ink',
            ].join(' ')}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
          >
            <p className="text-sm font-semibold">{boxEffect.label}</p>
            <p className="mt-1 text-lg font-bold">{boxEffect.message}</p>

            {boxEffect.type === 'big_particles' && (
              <div className="pointer-events-none absolute inset-0 overflow-visible">
                {Array.from({ length: 18 }, (_, index) => (
                  <motion.span
                    key={index}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-pop"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos((Math.PI * 2 * index) / 18) * 96,
                      y: Math.sin((Math.PI * 2 * index) / 18) * 52,
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
    </div>
  );
}
