/*import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
*/
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout(){
  return(
    <SafeAreaProvider>
      <React.Fragment>
        <StatusBar style="auto"/>
        <Stack>
          <Stack.Screen
           name="index"
            options={{
              title:"",
              headerShown: false
            }}
          />
        </Stack>
      </React.Fragment>

    </SafeAreaProvider>
    
  )
}