import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useSyncExternalStore } from 'react';

/** Only treat the device as offline on an explicit signal. `null` (unknown) counts as online. */
export function isOfflineState(state: Pick<NetInfoState, 'isConnected' | 'isInternetReachable'>): boolean {
  return state.isConnected === false || state.isInternetReachable === false;
}

let offline = false;
const listeners = new Set<() => void>();

NetInfo.addEventListener((state) => {
  const next = isOfflineState(state);
  if (next === offline) return;
  offline = next;
  listeners.forEach((listener) => listener());
});

export const getIsOffline = (): boolean => offline;

export function subscribeOffline(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIsOffline(): boolean {
  return useSyncExternalStore(subscribeOffline, getIsOffline, getIsOffline);
}

/** Authoritative one-off check (used by the mock transport, like a real request would hit the radio). */
export async function checkOffline(): Promise<boolean> {
  return isOfflineState(await NetInfo.fetch());
}
