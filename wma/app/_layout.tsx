import { Stack } from "expo-router";
import "react-native-reanimated";

import "../global.css";

import { AuthContextProvider, useSession } from "@/providers/auth-context";
import SplashScreenController from "./splash";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <AuthContextProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthContextProvider>
  );
}

// Separate this into a new component so it can access the SessionProvider context later
function RootNavigator() {
  const session = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!!session.user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session.user}>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
