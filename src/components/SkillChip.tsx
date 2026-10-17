import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export const SkillChip = memo(function SkillChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <AppText variant="caption" color={colors.chipText} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    maxWidth: '100%',
  },
});
