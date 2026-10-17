import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { COUNTRY_FILTERS, type CountryFilter } from '@/api/types';
import { countryLabel, useT } from '@/i18n';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

interface Props {
  value: CountryFilter;
  onChange: (value: CountryFilter) => void;
}

export const CountryFilterBar = memo(function CountryFilterBar({ value, onChange }: Props) {
  const t = useT();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel={t('filterLabel')}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {COUNTRY_FILTERS.map((option) => {
        const selected = option === value;
        const label = option === 'All' ? t('filterAll') : countryLabel(t, option);
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            // 40dp visual chip + 4dp hit slop top/bottom = 48dp touch target.
            hitSlop={{ top: 4, bottom: 4 }}
            onPress={() => onChange(option)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <AppText variant="label" color={selected ? colors.onPrimary : colors.text}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
});
