import { useEffect } from 'react';
import { useComboStore } from '../../domains/combo/combo.store';

export function ComboFeedback() {
  const lastReachedMilestone = useComboStore(
    (state) => state.lastReachedMilestone,
  );
  const lastEndedCombo = useComboStore((state) => state.lastEndedCombo);
  const maxCombo = useComboStore((state) => state.maxCombo);
  const clearReachedMilestone = useComboStore(
    (state) => state.clearReachedMilestone,
  );
  const clearEndedCombo = useComboStore((state) => state.clearEndedCombo);

  useEffect(() => {
    if (!lastReachedMilestone) {
      return;
    }

    const timer = window.setTimeout(clearReachedMilestone, 1100);

    return () => window.clearTimeout(timer);
  }, [clearReachedMilestone, lastReachedMilestone]);

  useEffect(() => {
    if (!lastEndedCombo) {
      return;
    }

    const timer = window.setTimeout(clearEndedCombo, 2600);

    return () => window.clearTimeout(timer);
  }, [clearEndedCombo, lastEndedCombo]);

  if (!lastReachedMilestone && !lastEndedCombo) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-20 flex w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2">
      {lastReachedMilestone && (
        <div className="rounded-md border border-pop bg-white px-4 py-3 text-center shadow-lg">
          <p className="text-sm font-semibold text-pop">
            {lastReachedMilestone} Combo
          </p>
          <p className="text-lg font-bold">좋은 흐름이에요</p>
        </div>
      )}

      {lastEndedCombo && (
        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-center shadow-lg">
          <p className="text-sm font-semibold text-slate-500">
            기록 달성
          </p>
          <p className="text-lg font-bold">{lastEndedCombo} Combo</p>
          {lastEndedCombo >= maxCombo && (
            <p className="mt-1 text-xs font-semibold text-pop">
              오늘 가장 긴 콤보예요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
