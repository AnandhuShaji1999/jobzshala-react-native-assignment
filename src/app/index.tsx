import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { CountryFilter, Job } from '@/api/types';
import { AppText } from '@/components/AppText';
import { CountryFilterBar } from '@/components/CountryFilterBar';
import { JobCard } from '@/components/JobCard';
import { Screen } from '@/components/Screen';
import { InlineNotice, ListSkeleton, StateMessage } from '@/components/StateViews';
import { useMatches } from '@/hooks/useMatches';
import { countryLabel, useT } from '@/i18n';
import { useIsOffline } from '@/lib/network';
import { colors, spacing } from '@/theme';

const keyExtractor = (job: Job) => job.id;

export default function MatchesScreen() {
  const t = useT();
  const router = useRouter();
  const offline = useIsOffline();
  const [country, setCountry] = useState<CountryFilter>('All');
  const matches = useMatches(country);

  const openJob = useCallback(
    (id: string) => router.push({ pathname: '/job/[id]', params: { id } }),
    [router],
  );
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Job>) => <JobCard job={item} onPress={openJob} />,
    [openJob],
  );

  const { fetchNextPage, hasNextPage, isFetchingNextPage, loadMoreFailed } = matches;
  const onEndReached = useCallback(() => {
    // After a failed page we wait for an explicit Retry instead of hammering the API on every scroll.
    if (hasNextPage && !isFetchingNextPage && !loadMoreFailed && !offline) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, loadMoreFailed, offline, fetchNextPage]);

  const footer = matches.loadMoreFailed ? (
    <InlineNotice
      message={t('loadMoreFailed')}
      actionLabel={t('retry')}
      onAction={() => void fetchNextPage()}
    />
  ) : matches.isFetchingNextPage ? (
    <View style={styles.footerLoading}>
      <ActivityIndicator color={colors.primary} />
      <AppText variant="caption" color={colors.textMuted}>
        {t('loadingMore')}
      </AppText>
    </View>
  ) : null;

  let body;
  if (matches.isLoading) {
    body = <ListSkeleton />;
  } else if (matches.isPausedEmpty) {
    body = (
      <StateMessage
        glyph="📡"
        title={t('offlineNoCacheTitle')}
        body={t('offlineNoCacheBody')}
        actionLabel={t('retry')}
        onAction={() => void matches.refetch()}
      />
    );
  } else if (matches.isError) {
    body = (
      <StateMessage
        glyph="⚠️"
        title={t('errorTitle')}
        body={t('errorBody')}
        actionLabel={t('retry')}
        onAction={() => void matches.refetch()}
      />
    );
  } else if (matches.jobs.length === 0) {
    body = (
      <StateMessage
        glyph="🔍"
        title={t('emptyTitle')}
        body={
          country === 'All'
            ? t('emptyBody')
            : t('emptyFilteredBody', { country: countryLabel(t, country) })
        }
        actionLabel={country === 'All' ? undefined : t('showAllCountries')}
        onAction={country === 'All' ? undefined : () => setCountry('All')}
      />
    );
  } else {
    body = (
      <FlashList
        data={matches.jobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={matches.refreshing}
        onRefresh={matches.refresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        ListHeaderComponent={
          matches.refreshFailed && !offline ? (
            <InlineNotice
              message={t('refreshFailed')}
              actionLabel={t('retry')}
              onAction={() => void matches.refresh()}
              dismissLabel={t('dismiss')}
              onDismiss={matches.dismissRefreshFailed}
            />
          ) : null
        }
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
      />
    );
  }

  return (
    <Screen>
      <CountryFilterBar value={country} onChange={setCountry} />
      {body}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.xl },
  footerLoading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
});
