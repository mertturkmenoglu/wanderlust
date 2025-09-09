import { api } from "@/api/api";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { EyeIcon, EyeOffIcon } from "lucide-react-native";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <KeyboardAvoidingView className="flex-1 bg-white px-16" behavior={"height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 flex justify-center flex-col">
          <View>
            <Image
              style={{ width: 100, height: 100 }}
              source={require("@/assets/images/logo.png")}
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

            <View className="bg-zinc-100 mt-4 w-full rounded-md flex-row items-center pr-2">
              <TextInput
                className="py-4 px-4 w-[90%]"
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                textContentType="password"
                secureTextEntry={!showPassword}
                enablesReturnKeyAutomatically
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <EyeIcon
                    className="pr-4"
                    size={24}
                    color={Colors.light.primary}
                  />
                ) : (
                  <EyeOffIcon
                    className="pr-4"
                    size={24}
                    color={Colors.light.primary}
                  />
                )}
              </Pressable>
            </View>

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
              className="bg-primary rounded-md w-full py-2"
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
          </View>

          <ThemedText
            type="small"
            className="mt-16 mb-16 text-center"
            style={{
              color: "#71717a",
            }}
          >
            By using this app, you agree to our Terms of Service and Privacy
            Policy.
          </ThemedText>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
