import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { useT } from '@/i18n';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

interface StateMessageProps {
  glyph: string;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/** One layout for empty / error / offline-without-cache so every "nothing to show" state looks designed. */
export function StateMessage({
  glyph,
  title,
  body,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: StateMessageProps) {
  return (
    <View style={styles.center}>
      <View style={styles.glyphCircle} accessibilityElementsHidden importantForAccessibility="no">
        <AppText style={styles.glyph}>{glyph}</AppText>
      </View>
      <AppText variant="title" style={styles.centerText} accessibilityRole="header">
        {title}
      </AppText>
      <AppText color={colors.textMuted} style={styles.centerText}>
        {body}
      </AppText>
      <View style={styles.actions}>
        {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
        {secondaryLabel && onSecondary ? (
          <Button label={secondaryLabel} onPress={onSecondary} variant="secondary" />
        ) : null}
      </View>
    </View>
  );
}

function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={[styles.bar, { width: '65%', height: 18 }]} />
      <View style={[styles.bar, { width: '45%' }]} />
      <View style={[styles.bar, { width: '35%' }]} />
      <View style={styles.skeletonChips}>
        <View style={[styles.bar, styles.skeletonChip]} />
        <View style={[styles.bar, styles.skeletonChip]} />
        <View style={[styles.bar, styles.skeletonChip]} />
      </View>
    </View>
  );
}

/** Shimmer-free pulse on a single animated node (cheap on low-end GPUs). */
export function ListSkeleton() {
  const t = useT();
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.skeletonWrap} accessibilityLiveRegion="polite" accessibilityLabel={t('loadingMatches')}>
      <View style={styles.loadingRow}>
        <ActivityIndicator color={colors.primary} />
        <AppText color={colors.textMuted} style={styles.loadingText}>
          {t('loadingMatches')}
        </AppText>
      </View>
      <Animated.View style={{ opacity }}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </Animated.View>
    </View>
  );
}

interface InlineNoticeProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
  dismissLabel?: string;
  onDismiss?: () => void;
}

/** Non-blocking error strip for failures that happen while content is already on screen. */
export function InlineNotice({ message, actionLabel, onAction, dismissLabel, onDismiss }: InlineNoticeProps) {
  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <AppText variant="label" color={colors.error} style={styles.noticeText}>
        {message}
      </AppText>
      <View style={styles.noticeActions}>
        <Button label={actionLabel} onPress={onAction} variant="secondary" />
        {dismissLabel && onDismiss ? <Button label={dismissLabel} onPress={onDismiss} variant="secondary" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  centerText: { textAlign: 'center' },
  glyphCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  glyph: { fontSize: 36, lineHeight: 46 },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.md },

  skeletonWrap: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  loadingText: { flexShrink: 1 },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  bar: { height: 12, borderRadius: 6, backgroundColor: colors.skeleton },
  skeletonChips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  skeletonChip: { width: 72, height: 22, borderRadius: radius.pill },

  notice: {
    backgroundColor: colors.errorBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  noticeText: { flexShrink: 1 },
  noticeActions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
});
