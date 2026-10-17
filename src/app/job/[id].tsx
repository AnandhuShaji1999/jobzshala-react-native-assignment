import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Job } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { MatchBadge } from '@/components/MatchBadge';
import { Screen } from '@/components/Screen';
import { SkillChip } from '@/components/SkillChip';
import { StateMessage } from '@/components/StateViews';
import { applyToJob } from '@/features/apply/applyToJob';
import { useJob } from '@/hooks/useJob';
import { countryLabel, formatNumber, useT } from '@/i18n';
import { useIsOffline } from '@/lib/network';
import { selectIsApplied, useApplyStore } from '@/state/applyStore';
import { colors, radius, spacing } from '@/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="heading" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

function BenefitRow({ label, provided }: { label: string; provided: boolean }) {
  const t = useT();
  const status = provided ? t('provided') : t('notProvided');
  return (
    <View style={styles.benefitRow} accessible accessibilityLabel={`${label}: ${status}`}>
      <AppText color={provided ? colors.success : colors.textMuted} style={styles.benefitMark}>
        {provided ? '✓' : '✗'}
      </AppText>
      <AppText variant="bodyStrong" style={styles.benefitLabel}>
        {label}
      </AppText>
      <AppText color={provided ? colors.success : colors.textMuted}>{status}</AppText>
    </View>
  );
}

function ApplyBar({ job }: { job: Job }) {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const offline = useIsOffline();
  const applied = useApplyStore(selectIsApplied(job.id));

  const onApply = useCallback(() => {
    // The store flips to "applied" synchronously inside this call (optimistic), before the network
    // answers, so the confirmation screen and the list's "Applied" tag are correct immediately.
    void applyToJob(job);
    router.push({ pathname: '/applied/[id]', params: { id: job.id } });
  }, [job, router]);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      {offline && !applied ? (
        <AppText variant="caption" color={colors.warn} accessibilityLiveRegion="polite" style={styles.barHint}>
          {t('applyOfflineHint')}
        </AppText>
      ) : null}
      {applied ? (
        <Button label={`✓ ${t('alreadyApplied')}`} onPress={() => undefined} variant="success" disabled />
      ) : (
        <Button
          label={t('apply')}
          accessibilityLabel={t('applyA11y', { title: job.title })}
          onPress={onApply}
          disabled={offline}
        />
      )}
    </View>
  );
}

export default function JobDetailScreen() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { job, isLoading, isError, isPausedEmpty, refetch } = useJob(id);

  if (!job) {
    return (
      <Screen>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText color={colors.textMuted}>{t('loadingJob')}</AppText>
          </View>
        ) : (
          <StateMessage
            glyph={isPausedEmpty ? '📡' : '⚠️'}
            title={isPausedEmpty ? t('offlineNoCacheTitle') : t('errorTitle')}
            body={isError ? t('jobLoadError') : t('offlineNoCacheBody')}
            actionLabel={t('retry')}
            onAction={() => void refetch()}
          />
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <AppText variant="title" style={styles.title} accessibilityRole="header">
              {job.title}
            </AppText>
            <MatchBadge score={job.match_score} />
          </View>
          <AppText color={colors.textMuted}>{job.employer_display}</AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {job.city} · {countryLabel(t, job.country)}
          </AppText>
          <AppText variant="heading" style={styles.salary}>
            {t('salaryRange', {
              min: formatNumber(job.salary_min_aed),
              max: formatNumber(job.salary_max_aed),
            })}
          </AppText>
        </View>

        <View style={styles.reason}>
          <AppText variant="label" color={colors.success}>
            {t('whyMatch')}
          </AppText>
          <AppText>{job.match_reason}</AppText>
        </View>

        <Section title={t('aboutJob')}>
          <AppText>{job.description}</AppText>
        </Section>

        <Section title={t('requirements')}>
          {job.requirements.map((requirement) => (
            <View key={requirement} style={styles.bulletRow}>
              <AppText color={colors.textMuted}>•</AppText>
              <AppText style={styles.bulletText}>{requirement}</AppText>
            </View>
          ))}
        </Section>

        <Section title={t('benefits')}>
          <BenefitRow label={t('accommodation')} provided={job.benefits.accommodation} />
          <BenefitRow label={t('food')} provided={job.benefits.food} />
          <BenefitRow label={t('visa')} provided={job.benefits.visa} />
        </Section>

        <Section title={t('skills')}>
          <View style={styles.chips}>
            {job.skills.map((skill) => (
              <SkillChip key={skill} label={skill} />
            ))}
          </View>
        </Section>
      </ScrollView>

      <ApplyBar job={job} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  header: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  title: { flex: 1 },
  salary: { marginTop: spacing.sm },
  reason: {
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  section: { gap: spacing.sm },
  bulletRow: { flexDirection: 'row', gap: spacing.sm },
  bulletText: { flex: 1 },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexWrap: 'wrap',
  },
  benefitMark: { width: 20, textAlign: 'center', fontWeight: '700' },
  benefitLabel: { flex: 1, minWidth: 110 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  barHint: { textAlign: 'center' },
});
