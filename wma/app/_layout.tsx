import { Stack } from "expo-router";
import "react-native-reanimated";

import "../global.css";

import { isApiError } from "@/api/api";
import { AuthContextProvider, useSession } from "@/providers/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";
import SplashScreenController from "./splash";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      onError: (err) => {
        if (isApiError(err)) {
          console.log({ err });
          ToastAndroid.show(
            err.detail ?? "Something went wrong",
            ToastAndroid.SHORT
          );
        } else {
          console.log(JSON.stringify(err));
          ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        }
      },
    },
  },
});

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SplashScreenController />
        <RootNavigator />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

// Separate this into a new component so it can access the SessionProvider context later
function RootNavigator() {
  const session = useSession();

  return (
    <Stack>
      <Stack.Protected guard={!!session.user}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
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
