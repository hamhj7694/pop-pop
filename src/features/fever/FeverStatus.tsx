import { motion } from 'framer-motion';
import { useFeverStore } from '../../domains/fever/fever.store';

export function FeverStatus() {
  const isFeverActive = useFeverStore((state) => state.isFeverActive);
  const remainingSeconds = useFeverStore((state) => state.remainingSeconds);

  if (!isFeverActive) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-20 z-20 flex -translate-x-1/2 items-center gap-2 rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-black text-amber-900 shadow-lg"
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
    >
      <span>FEVER TIME</span>
      <span className="rounded bg-amber-100 px-2 py-0.5">
        {remainingSeconds}s
      </span>
    </motion.div>
  );
}
