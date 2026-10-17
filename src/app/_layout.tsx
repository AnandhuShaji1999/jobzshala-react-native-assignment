import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Snackbar } from '@/components/Snackbar';
import { useT } from '@/i18n';
import { CACHE_MAX_AGE_MS, persister, queryClient } from '@/state/queryClient';
import { useStoresHydrated } from '@/state/useHydrated';
import { colors } from '@/theme';

function AppStack() {
  const t = useT();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        headerRight: () => <LanguageToggle />,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('appTitle') }} />
      <Stack.Screen name="job/[id]" options={{ title: t('jobDetailTitle') }} />
      <Stack.Screen name="applied/[id]" options={{ title: t('applicationTitle') }} />
    </Stack>
  );
}

export default function RootLayout() {
  const hydrated = useStoresHydrated();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      // `buster` invalidates saved jobs if the cached data shape ever changes between app versions.
      persistOptions={{ persister, maxAge: CACHE_MAX_AGE_MS, buster: 'v1' }}
    >
      <StatusBar style="dark" />
      <AppStack />
      <Snackbar />
      {/* Covers the first frames while language + applied state load, so nothing flashes unapplied/English. */}
      {hydrated ? null : (
        <View style={styles.boot} pointerEvents="auto">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
