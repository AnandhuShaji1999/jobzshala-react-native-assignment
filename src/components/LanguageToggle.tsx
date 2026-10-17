import { Pressable, StyleSheet, View } from 'react-native';
import { useLocale, useT } from '@/i18n';
import { useLocaleStore } from '@/state/localeStore';
import { MIN_TOUCH, colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

/** Two-segment EN | हि switch for the header. One tap flips the language everywhere. */
export function LanguageToggle() {
  const locale = useLocale();
  const t = useT();
  const toggleLocale = useLocaleStore((state) => state.toggleLocale);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('languageToggleLabel')}
      onPress={toggleLocale}
      style={styles.hit}
    >
      <View style={styles.pill}>
        <View style={[styles.segment, locale === 'en' && styles.active]}>
          <AppText variant="label" color={locale === 'en' ? colors.onPrimary : colors.text}>
            EN
          </AppText>
        </View>
        <View style={[styles.segment, locale === 'hi' && styles.active]}>
          <AppText variant="label" color={locale === 'hi' ? colors.onPrimary : colors.text}>
            हि
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { minHeight: MIN_TOUCH, minWidth: MIN_TOUCH, justifyContent: 'center', paddingHorizontal: spacing.xs },
  pill: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 2,
  },
  segment: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill, minWidth: 40, alignItems: 'center' },
  active: { backgroundColor: colors.primary },
});
