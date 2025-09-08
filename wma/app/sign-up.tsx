import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, TextInput, View } from "react-native";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ThemedView className="flex-1 items-center px-16">
      <Image
        style={{ width: 100, height: 100 }}
        source={require("@/assets/images/logo.png")}
        className="mt-32"
      />

      <ThemedText type="subtitle" className="mt-16">
        Sign up to Wanderlust
      </ThemedText>

      <TextInput
        className="bg-zinc-100 rounded-md w-full mt-12 py-4 px-4"
        onChangeText={setFullName}
        value={fullName}
        textContentType="name"
        placeholder="Full Name"
      />

      <TextInput
        className="bg-zinc-100 rounded-md w-full mt-4 py-4 px-4"
        onChangeText={setUsername}
        value={username}
        textContentType="username"
        placeholder="Username"
      />

      <TextInput
        className="bg-zinc-100 rounded-md w-full mt-4 py-4 px-4"
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
        onPress={() => Alert.alert("Sign in clicked")}
        className="bg-Colors-light-primary rounded-md w-full py-2 mt-4"
      >
        <ThemedText
          className="text-center"
          style={{
            color: "white",
          }}
        >
          Sign up
        </ThemedText>
      </Pressable>

      <View className="flex flex-row justify-center items-end gap-2">
        <ThemedText type="default" className="mt-4">
          Already have an account?
        </ThemedText>

        <Link href="/sign-in">
          <ThemedText
            type="default"
            className=""
            style={{
              color: Colors.light.primary,
            }}
          >
            Sign in
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
