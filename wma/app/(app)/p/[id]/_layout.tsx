import { Stack } from "expo-router";

export default function PageLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add-to-list-modal"
        options={{
          presentation: "modal",
          headerTitle: "Add to list",
        }}
      />

      <Stack.Screen
        name="reviews"
        options={{
          presentation: "modal",
          headerTitle: "Reviews",
        }}
      />
    </Stack>
  );
}
