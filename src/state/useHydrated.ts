import { useEffect, useState } from 'react';
import { useApplyStore } from './applyStore';
import { useLocaleStore } from './localeStore';

/**
 * True once persisted language and applied-jobs state are loaded from storage.
 * Without this gate the list would flash "not applied" / English for a frame after a restart.
 */
export function useStoresHydrated(): boolean {
  const [ready, setReady] = useState(
    () => useApplyStore.persist.hasHydrated() && useLocaleStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const check = () => {
      if (useApplyStore.persist.hasHydrated() && useLocaleStore.persist.hasHydrated()) setReady(true);
    };
    const unsubscribers = [
      useApplyStore.persist.onFinishHydration(check),
      useLocaleStore.persist.onFinishHydration(check),
    ];
    check();
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  return ready;
}
