import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors } from '@/theme';

export type TextVariant = 'title' | 'heading' | 'body' | 'bodyStrong' | 'caption' | 'label';

// Line heights are ~1.45x font size: Devanagari has tall ascenders/matras and clips at tighter values.
const VARIANTS: Record<TextVariant, TextStyle> = {
  title: { fontSize: 22, lineHeight: 32, fontWeight: '700' },
  heading: { fontSize: 17, lineHeight: 25, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
}

export function AppText({ variant = 'body', color = colors.text, style, ...rest }: AppTextProps) {
  // Cap system font scaling so a user with "Largest" font size still gets a usable layout.
  return <Text maxFontSizeMultiplier={1.3} style={[VARIANTS[variant], { color }, style]} {...rest} />;
}
