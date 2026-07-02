import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import { Epilogue_700Bold, Epilogue_800ExtraBold } from "@expo-google-fonts/epilogue";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

/**
 * Root layout: loads Epilogue (headings/brand) and Inter (body/labels)
 * before rendering, then hides the splash screen. A Stack wraps the
 * tabs group and the detail routes (paths/[slug], lessons/[slug]).
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Epilogue_700Bold,
    Epilogue_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="paths/[slug]" />
        <Stack.Screen name="lessons/[slug]" />
      </Stack>
    </>
  );
}
