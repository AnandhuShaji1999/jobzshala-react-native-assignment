import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { MIN_TOUCH, colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityLabel,
}: ButtonProps) {
  const inactive = disabled || loading;
  const background =
    variant === 'secondary' ? colors.surface : variant === 'success' ? colors.successBg : colors.primary;
  const foreground =
    variant === 'secondary' ? colors.primary : variant === 'success' ? colors.success : colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      android_ripple={inactive ? undefined : { color: '#00000022' }}
      style={[
        styles.base,
        { backgroundColor: background },
        variant === 'secondary' && styles.secondaryBorder,
        disabled && variant !== 'success' && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <AppText
          variant="bodyStrong"
          color={disabled && variant !== 'success' ? colors.disabledText : foreground}
          style={styles.label}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  secondaryBorder: { borderWidth: 1, borderColor: colors.primary },
  disabled: { backgroundColor: colors.disabledBg },
  label: { textAlign: 'center' },
});
