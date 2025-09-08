import { api } from "@/api/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = api.useMutation("post", "/api/v2/auth/credentials/login", {
    onSuccess: async () => {
      await qc.invalidateQueries();
      ToastAndroid.show("signed in", ToastAndroid.SHORT);
      router.navigate("/");
    },
  });

  return (
    <ThemedView className="flex-1 items-center px-16">
      <Image
        style={{ width: 100, height: 100 }}
        source={require("@/assets/images/logo.png")}
        className="mt-64"
      />

      <ThemedText type="subtitle" className="mt-16">
        Sign in to Wanderlust
      </ThemedText>

      <TextInput
        className="bg-zinc-100 rounded-md w-full mt-12 py-4 px-4"
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
        placeholder="Email"
      />

      <TextInput
        className="bg-zinc-100 rounded-md w-full mt-4 py-4 px-4"
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        textContentType="password"
      />

      <Pressable
        onPress={() => Alert.alert("Forgot password clicked")}
        className="text-primary my-4 self-end"
      >
        <ThemedText
          type="small"
          style={{
            color: Colors.light.primary,
          }}
        >
          Forgot password?
        </ThemedText>
      </Pressable>

      <Pressable
        onPress={() => {
          mutation.mutate({
            body: {
              email,
              password,
            },
          });
        }}
        className="bg-Colors-light-primary rounded-md w-full py-2"
      >
        <ThemedText
          className="text-center"
          style={{
            color: "white",
          }}
        >
          Sign in
        </ThemedText>
      </Pressable>

      <View className="flex flex-row justify-center items-end gap-2">
        <ThemedText type="default" className="mt-4">
          Don&apos;t have an account?
        </ThemedText>

        <Link href="/sign-up">
          <ThemedText
            type="default"
            className=""
            style={{
              color: Colors.light.primary,
            }}
          >
            Sign up
          </ThemedText>
        </Link>
      </View>

      <ThemedText
        type="small"
        className="mt-auto mb-16"
        style={{
          color: "#71717a",
        }}
      >
        By using this app, you agree to our Terms of Service and Privacy Policy.
      </ThemedText>
    </ThemedView>
  );
}
