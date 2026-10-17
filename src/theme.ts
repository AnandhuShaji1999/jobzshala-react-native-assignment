export const colors = {
  bg: '#F3F5F8',
  surface: '#FFFFFF',
  text: '#14212B',
  textMuted: '#4F5D6B',
  border: '#DCE2E9',
  primary: '#0B5FA5',
  onPrimary: '#FFFFFF',
  chipBg: '#E8F0F8',
  chipText: '#1B4B78',
  successBg: '#E1F3E8',
  success: '#146C3A',
  warnBg: '#FFF0D0',
  warn: '#7A4300',
  errorBg: '#FCE6E5',
  error: '#A12622',
  disabledBg: '#CBD3DB',
  disabledText: '#46525E',
  skeleton: '#E3E8EE',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, pill: 999 } as const;

/** Minimum touch target on Android (dp). */
export const MIN_TOUCH = 48;
