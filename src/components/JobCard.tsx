import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Job } from '@/api/types';
import { countryLabel, formatNumber, useT } from '@/i18n';
import { selectIsApplied, useApplyStore } from '@/state/applyStore';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { MatchBadge } from './MatchBadge';
import { SkillChip } from './SkillChip';

interface JobCardProps {
  job: Job;
  onPress: (jobId: string) => void;
}

const MAX_CHIPS = 3;

/**
 * Memoised: with a stable `onPress` and an immutable `job` object it only re-renders when its own
 * applied state or the language changes, not when the list scrolls, paginates or refreshes.
 */
export const JobCard = memo(function JobCard({ job, onPress }: JobCardProps) {
  const t = useT();
  const applied = useApplyStore(selectIsApplied(job.id));

  const salary = t('salaryRange', {
    min: formatNumber(job.salary_min_aed),
    max: formatNumber(job.salary_max_aed),
  });
  const matchText = t('matchPercent', { pct: Math.round(job.match_score) });
  const location = `${job.city} · ${countryLabel(t, job.country)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t('openJob', { title: job.title })}. ${job.employer_display}. ${location}. ${salary}. ${matchText}${
        applied ? `. ${t('applied')}` : ''
      }`}
      onPress={() => onPress(job.id)}
      android_ripple={{ color: '#0B5FA51A' }}
      style={styles.card}
    >
      <View style={styles.titleRow}>
        <AppText variant="heading" style={styles.title}>
          {job.title}
        </AppText>
        <MatchBadge score={job.match_score} />
      </View>

      <AppText color={colors.textMuted}>{job.employer_display}</AppText>
      <AppText variant="caption" color={colors.textMuted}>
        {location}
      </AppText>

      <View style={styles.salaryRow}>
        <AppText variant="bodyStrong" style={styles.salary}>
          {salary}
        </AppText>
        {applied ? (
          <View style={styles.appliedPill}>
            <AppText variant="label" color={colors.success}>
              ✓ {t('applied')}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.chips}>
        {job.skills.slice(0, MAX_CHIPS).map((skill) => (
          <SkillChip key={skill} label={skill} />
        ))}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
    overflow: 'hidden',
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  title: { flex: 1 },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  salary: { flexShrink: 1 },
  appliedPill: {
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
});
