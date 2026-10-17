import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { OfflineBanner } from './OfflineBanner';

/** Every screen sits in this frame so the offline banner appears directly under the header, everywhere. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <View style={styles.screen}>
      <OfflineBanner />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.bg } });
