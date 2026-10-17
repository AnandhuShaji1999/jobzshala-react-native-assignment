import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useT } from '@/i18n';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

function tone(score: number) {
  if (score >= 80) return { bg: colors.successBg, fg: colors.success };
  if (score >= 60) return { bg: colors.warnBg, fg: colors.warn };
  return { bg: colors.chipBg, fg: colors.chipText };
}

export const MatchBadge = memo(function MatchBadge({ score }: { score: number }) {
  const t = useT();
  const { bg, fg } = tone(score);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <AppText variant="label" color={fg}>
        {t('matchPercent', { pct: Math.round(score) })}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4, alignSelf: 'flex-start' },
});
