import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { applyToJob } from '@/features/apply/applyToJob';
import { useJob } from '@/hooks/useJob';
import { useT } from '@/i18n';
import { useIsOffline } from '@/lib/network';
import { useApplyStore } from '@/state/applyStore';
import { colors, spacing } from '@/theme';

export default function AppliedScreen() {
  const t = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { job } = useJob(id);
  const offline = useIsOffline();

  const confirmed = useApplyStore((state) => state.applied[id] !== undefined);
  const pending = useApplyStore((state) => state.pending[id] === true);
  const failure = useApplyStore((state) => state.failures[id]);
  const clearFailure = useApplyStore((state) => state.clearFailure);

  const title = job?.title ?? '';

  const backToMatches = useCallback(() => router.dismissTo('/'), [router]);
  const backToJob = useCallback(() => {
    clearFailure(id);
    router.back();
  }, [clearFailure, id, router]);
  const tryAgain = useCallback(() => {
    if (job) void applyToJob(job); // begin() clears the failure and flips back to the optimistic success view
  }, [job]);

  // Optimistic success: shown the moment Apply is tapped, while `pending`, and kept once confirmed.
  if (confirmed || pending) {
    return (
      <Screen>
        <View style={styles.center}>
          <View style={[styles.circle, { backgroundColor: colors.successBg }]}>
            <AppText style={styles.circleGlyph} color={colors.success}>
              ✓
            </AppText>
          </View>
          <AppText variant="title" style={styles.centerText} accessibilityRole="header">
            {t('confirmTitle')}
          </AppText>
          <AppText color={colors.textMuted} style={styles.centerText}>
            {t('confirmBody', { title })}
          </AppText>
          {pending ? (
            <View style={styles.syncRow} accessibilityLiveRegion="polite">
              <ActivityIndicator size="small" color={colors.textMuted} />
              <AppText variant="caption" color={colors.textMuted}>
                {t('confirmSyncing')}
              </AppText>
            </View>
          ) : null}
          <View style={styles.actions}>
            <Button label={t('backToMatches')} onPress={backToMatches} />
            <Button label={t('viewJob')} onPress={backToJob} variant="secondary" />
          </View>
        </View>
      </Screen>
    );
  }

  // Rolled back: say clearly that nothing was sent and offer a way forward.
  if (failure) {
    return (
      <Screen>
        <View style={styles.center}>
          <View style={[styles.circle, { backgroundColor: colors.errorBg }]}>
            <AppText style={styles.circleGlyph} color={colors.error}>
              !
            </AppText>
          </View>
          <AppText variant="title" style={styles.centerText} color={colors.error} accessibilityRole="header">
            {t('applyFailedTitle')}
          </AppText>
          <AppText
            color={colors.textMuted}
            style={styles.centerText}
            accessibilityLiveRegion="assertive"
          >
            {failure === 'offline' ? t('applyFailedOffline') : t('applyFailedServer')}
          </AppText>
          {offline ? (
            <AppText variant="caption" color={colors.warn} style={styles.centerText}>
              {t('applyOfflineHint')}
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <Button label={t('tryAgain')} onPress={tryAgain} disabled={offline || !job} />
            <Button label={t('backToJob')} onPress={backToJob} variant="secondary" />
          </View>
        </View>
      </Screen>
    );
  }

  // Reached without applying (e.g. a stale deep link).
  return (
    <Screen>
      <View style={styles.center}>
        <AppText variant="title" style={styles.centerText} accessibilityRole="header">
          {t('notAppliedTitle')}
        </AppText>
        <AppText color={colors.textMuted} style={styles.centerText}>
          {t('notAppliedBody')}
        </AppText>
        <View style={styles.actions}>
          <Button label={t('backToMatches')} onPress={backToMatches} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  centerText: { textAlign: 'center' },
  circle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  circleGlyph: { fontSize: 44, lineHeight: 56, fontWeight: '700' },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.lg },
});
