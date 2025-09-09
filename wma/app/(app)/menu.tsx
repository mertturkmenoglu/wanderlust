import {
  Image,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  type PressableProps,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "@/api/api";
import { cn } from "@/lib/utils";
import { useSession } from "@/providers/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  BellIcon,
  BookMarkedIcon,
  BookmarkIcon,
  ListIcon,
  LogOutIcon,
  MapIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react-native";

function useUser() {
  const { user } = useSession();
  return user!;
}

type Props = PressableProps & {
  icon: typeof UserIcon;
  text: string;
  variant?: "default" | "danger";
};

function Button({
  className,
  icon: Icon,
  text,
  variant = "default",
  ...props
}: Props) {
  return (
    <Pressable
      className={cn("px-4 py-4 flex flex-row items-center gap-2", className)}
      {...props}
      android_ripple={{
        radius: 500,
        borderless: false,
        color: variant === "default" ? "#D8E8E0" : "#FFE0DA",
      }}
    >
      <Icon size={16} color={variant === "default" ? "#18181b" : "#ef4444"} />
      <Text
        className={cn("pl-4", {
          "text-zinc-900": variant === "default",
          "text-red-500": variant === "danger",
        })}
      >
        {text}
      </Text>
    </Pressable>
  );
}

export default function TabTwoScreen() {
  const user = useUser();
  const router = useRouter();
  const qc = useQueryClient();
  const signOutMutation = api.useMutation("post", "/api/v2/auth/logout", {
    onSuccess: async () => {
      await qc.invalidateQueries();
      await qc.refetchQueries();
      ToastAndroid.show("Signed out", ToastAndroid.SHORT);
      router.navigate("/sign-in");
      router.reload();
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="p-4">
        <View className="flex flex-row items-center gap-4 p-2 rounded-md">
          {user.profileImage !== null ? (
            <Image
              source={{
                uri: user.profileImage,
              }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Image
              source={require("@/assets/images/profile.png")}
              className="w-24 h-24 rounded-full"
            />
          )}
          <View>
            <Text className="font-semibold text-2xl">{user.fullName}</Text>
            <Text className="text-primary text-lg">@{user.username}</Text>
          </View>
        </View>

        <Button icon={UserIcon} text="View Profile"></Button>
        <Button icon={BellIcon} text="Notifications"></Button>
        <Button icon={SettingsIcon} text="Settings"></Button>
        <Button icon={MapIcon} text="Trips"></Button>
        <Button icon={UsersIcon} text="Friends"></Button>
        <Button icon={BookmarkIcon} text="Bookmarks"></Button>
        <Button icon={ListIcon} text="My Lists"></Button>
        <Button icon={BookMarkedIcon} text="Diary"></Button>

        <Button
          onPress={() => {
            signOutMutation.mutate({});
          }}
          icon={LogOutIcon}
          text="Sign Out"
          variant="danger"
        ></Button>
      </ScrollView>
    </SafeAreaView>
  );
}
