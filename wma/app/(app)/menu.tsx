import { Pressable, ScrollView, StyleSheet, ToastAndroid } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "@/api/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const signOutMutation = api.useMutation("post", "/api/v2/auth/logout", {
    onSuccess: async () => {
      await qc.invalidateQueries();
      ToastAndroid.show("Signed out", ToastAndroid.SHORT);
      router.navigate("/sign-in");
    },
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              gap: 32,
            }}
          >
            Menu
          </ThemedText>
        </ThemedView>
        <ThemedText>Menu page</ThemedText>
        <Pressable
          onPress={() => {
            signOutMutation.mutate({});
          }}
        >
          <ThemedText>Sign Out</ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 32,
  },
});
