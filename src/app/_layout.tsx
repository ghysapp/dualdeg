import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AdsBootstrap } from '@/ads/AdsBootstrap';
import { LocationsProvider } from '@/state/locations';
import { PurchasesProvider } from '@/state/purchases';
import { SettingsProvider } from '@/state/settings';
import { fontMap } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts(fontMap);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SettingsProvider>
      <PurchasesProvider>
        <AdsBootstrap />
        <LocationsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
              name="day"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
                gestureEnabled: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="add-city"
              options={{ presentation: 'modal', headerShown: false }}
            />
            <Stack.Screen
              name="settings"
              options={{ presentation: 'modal', headerShown: false }}
            />
            <Stack.Screen
              name="manage-cities"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
                gestureEnabled: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="language"
              options={{
                presentation: 'card',
                animation: 'slide_from_right',
                gestureEnabled: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="attribution"
              options={{ presentation: 'modal', headerShown: false }}
            />
          </Stack>
        </LocationsProvider>
      </PurchasesProvider>
    </SettingsProvider>
  );
}
