import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { jobsApi } from '@/api/client';
import { isNetworkError } from '@/api/errors';
import type { CountryFilter, Job, MatchesPage } from '@/api/types';

export const matchesKey = (country: CountryFilter) => ['matches', country] as const;

const NO_JOBS: Job[] = [];

export function useMatches(country: CountryFilter) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);

  const query = useInfiniteQuery({
    queryKey: matchesKey(country),
    queryFn: ({ pageParam }) => jobsApi.getMatches(country, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.has_more ? last.page + 1 : undefined),
  });

  const jobs = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? NO_JOBS, [query.data]);

  /**
   * Pull-to-refresh fetches only page 1 and replaces the cache with it. Calling `refetch()` would
   * re-request every loaded page one after another (~1 s each on this network) and one flaky page
   * would fail the whole refresh. If the refresh fails, the data already on screen is kept.
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshFailed(false);
    try {
      const first = await jobsApi.getMatches(country, 1);
      queryClient.setQueryData<InfiniteData<MatchesPage, number>>(matchesKey(country), {
        pages: [first],
        pageParams: [1],
      });
    } catch (error) {
      // Offline already has its own banner; don't stack a second message on top.
      if (!isNetworkError(error)) setRefreshFailed(true);
    } finally {
      setRefreshing(false);
    }
  }, [country, queryClient]);

  const dismissRefreshFailed = useCallback(() => setRefreshFailed(false), []);

  return {
    jobs,
    total: query.data?.pages[0]?.total ?? 0,
    /** First load, nothing cached. */
    isLoading: query.isPending && query.fetchStatus !== 'paused',
    /** First load while offline with nothing saved. */
    isPausedEmpty: query.isPending && query.fetchStatus === 'paused',
    /** First load failed and there is nothing to show. */
    isError: query.isError && jobs.length === 0,
    refreshing,
    refreshFailed,
    dismissRefreshFailed,
    refresh,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    /** A "load more" failed but earlier pages are still on screen. */
    loadMoreFailed: query.isFetchNextPageError,
  };
}
