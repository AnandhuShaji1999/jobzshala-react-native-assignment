import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { getIsOffline, subscribeOffline } from '@/lib/network';

export const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days of saved jobs

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime must be >= the persister's maxAge or restored data is garbage collected immediately.
      gcTime: CACHE_MAX_AGE_MS,
      staleTime: 60 * 1000,
      // One quick automatic retry hides most transient 5xx without making a real failure take 10 s+.
      retry: 1,
      retryDelay: 400,
      refetchOnWindowFocus: false,
    },
  },
});

// Feed react-query the same offline signal the UI uses, so fetches pause offline and
// resume (refetchOnReconnect) when the connection returns.
onlineManager.setOnline(!getIsOffline());
onlineManager.setEventListener((setOnline) => subscribeOffline(() => setOnline(!getIsOffline())));

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'jobzshala-query-cache',
  throttleTime: 2000,
});
