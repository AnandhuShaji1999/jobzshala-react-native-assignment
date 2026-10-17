import { StyleSheet, View } from 'react-native';
import { useT } from '@/i18n';
import { useIsOffline } from '@/lib/network';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';

export function OfflineBanner() {
  const offline = useIsOffline();
  const t = useT();
  if (!offline) return null;

  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.banner}>
      <AppText variant="label" color={colors.warn} style={styles.text}>
        {t('offlineBanner')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warnBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0D79C',
  },
  text: { textAlign: 'center' },
});
