import { useQuery, useQueryClient, type InfiniteData, type QueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/client';
import type { Job, MatchesPage } from '@/api/types';

export const jobKey = (id: string) => ['job', id] as const;

function findInMatchesCache(queryClient: QueryClient, id: string): Job | undefined {
  const caches = queryClient.getQueriesData<InfiniteData<MatchesPage>>({ queryKey: ['matches'] });
  for (const [, data] of caches) {
    for (const page of data?.pages ?? []) {
      const hit = page.items.find((job) => job.id === id);
      if (hit) return hit;
    }
  }
  return undefined;
}

/**
 * The detail screen opens instantly from the list data we already have (and keeps working offline),
 * then refreshes from GET /jobs/:id in the background. A failed background refresh never replaces
 * content with an error screen; only "nothing to show at all" does.
 */
export function useJob(id: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: jobKey(id),
    queryFn: () => jobsApi.getJob(id),
    initialData: () => findInMatchesCache(queryClient, id),
    initialDataUpdatedAt: 0, // seeded data counts as stale, so it still refreshes once
  });

  return {
    job: query.data,
    isLoading: query.data === undefined && query.fetchStatus !== 'paused' && !query.isError,
    isError: query.data === undefined && query.isError,
    isPausedEmpty: query.data === undefined && query.fetchStatus === 'paused',
    refetch: query.refetch,
  };
}
