import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar"
/*
  Reminder: can use SafeAreaView from react-native-safe-area-context
  within the pages. Or can use useSafeAreaInset within the pages. SafeAreaView
  is more for static and has it's own padding. useSafeAreaInset to control padding 
  yourself.

  - Will need to add Auth and theme once get to that point
*/

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto"/>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}