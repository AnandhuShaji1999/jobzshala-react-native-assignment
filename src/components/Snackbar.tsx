import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '@/i18n';
import { useApplyStore } from '@/state/applyStore';
import { MIN_TOUCH, colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

const AUTO_DISMISS_MS = 6000;

/**
 * Tells the user when an optimistic apply was rolled back while they were NOT looking at the
 * confirmation screen (that screen shows its own full error). Without this the "Applied" tag on
 * the list would silently vanish.
 */
export function Snackbar() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const notice = useApplyStore((state) => state.notice);
  const dismiss = useApplyStore((state) => state.dismissNotice);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notice, dismiss]);

  if (!notice || pathname.startsWith('/applied')) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: insets.bottom + 96 }]}
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.bar}>
        <AppText variant="label" color={colors.onPrimary} style={styles.text}>
          {t('applyFailedSnackbar', { title: notice.jobTitle })}
        </AppText>
        <Pressable accessibilityRole="button" accessibilityLabel={t('dismiss')} onPress={dismiss} style={styles.action}>
          <AppText variant="label" color="#BBD9F5">
            {t('dismiss')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.lg, right: spacing.lg },
  bar: {
    backgroundColor: '#1F2A33',
    borderRadius: radius.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    elevation: 6,
  },
  text: { flex: 1, paddingVertical: spacing.md },
  action: { minHeight: MIN_TOUCH, justifyContent: 'center', paddingHorizontal: spacing.md },
});
