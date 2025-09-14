import { api } from "@/api/api";
import ParallaxScrollView from "@/components/ui/parallax-scroll-view";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/hooks/use-user";
import { blurhash } from "@/lib/image";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { Suspense } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";

export default function PageLayout() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const query = api.useSuspenseQuery("get", "/api/v2/users/{username}", {
    params: {
      path: {
        username,
      },
    },
  });

  const user = query.data.profile;

  const meta = query.data.meta;
  const router = useRouter();
  const thisUser = useUser();
  const isThisUser = thisUser.username === user.username;
  const qc = useQueryClient();
  const segments = useSegments();

  const changeFollowMutation = api.useMutation(
    "post",
    "/api/v2/users/follow/{username}",
    {
      onSuccess: async () => {
        await qc.invalidateQueries();
        ToastAndroid.show(
          meta.isFollowing ? "Unfollowed" : "Followed",
          ToastAndroid.SHORT
        );
      },
    }
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: user.bannerImage ?? "https://i.imgur.com/EwvUEmR.jpg",
          }}
          style={{
            width: "100%",
            height: 256,
          }}
          placeholder={{
            blurhash,
          }}
        />
      }
    >
      <View className="flex flex-row gap-4 items-center">
        <Image
          source={
            user.profileImage !== null
              ? { uri: user.profileImage }
              : require("@/assets/images/profile.png")
          }
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
          }}
          cachePolicy="memory-disk"
          placeholder={{ blurhash }}
          contentFit="cover"
        />
        <View>
          <Text className="font-bold text-4xl mt-2">{user.fullName}</Text>
          <Text className="text-primary text-lg">@{user.username}</Text>
        </View>
      </View>

      {user.bio !== null ? (
        <Text className="text-zinc-500 mt-4 text-sm">{user.bio}</Text>
      ) : null}

      {isThisUser ? (
        <Pressable
          className="border border-zinc-300 rounded-md p-2 mt-4 flex flex-row justify-center items-center text-zinc-500"
          onPress={() => {
            // TODO: Change later
            router.navigate({
              pathname: "/(app)",
            });
          }}
        >
          <Text>Settings</Text>
        </Pressable>
      ) : (
        <Pressable
          className="border border-zinc-300 rounded-md p-2 mt-4 flex flex-row justify-center items-center text-zinc-500"
          disabled={changeFollowMutation.isPending}
          onPress={() => {
            changeFollowMutation.mutate({
              params: {
                path: {
                  username: user.username,
                },
              },
            });
          }}
        >
          {changeFollowMutation.isPending ? (
            <ActivityIndicator />
          ) : (
            <Text>{meta.isFollowing ? "Following" : "Follow"}</Text>
          )}
        </Pressable>
      )}

      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: Colors.light.text,
          marginTop: 16,
        }}
      />
      <Tabs>
        <TabList className="mt-4">
          <TabTrigger
            name="index"
            href={{
              pathname: "/(app)/u/[username]",
              params: {
                username: user.username,
              },
            }}
          >
            <Text
              className={cn("font-medium", {
                "text-primary": segments.at(-1) === "[username]",
              })}
            >
              Profile
            </Text>
          </TabTrigger>

          <TabTrigger
            name="activities"
            href={{
              pathname: "/(app)/u/[username]/activities",
              params: {
                username: user.username,
              },
            }}
          >
            <Text
              className={cn("font-medium", {
                "text-primary": segments.at(-1) === "activities",
              })}
            >
              Activities
            </Text>
          </TabTrigger>

          <TabTrigger
            name="reviews"
            href={{
              pathname: "/(app)/u/[username]/reviews",
              params: {
                username: user.username,
              },
            }}
          >
            <Text
              className={cn("font-medium", {
                "text-primary": segments.at(-1) === "reviews",
              })}
            >
              Reviews
            </Text>
          </TabTrigger>

          <TabTrigger
            name="lists"
            href={{
              pathname: "/(app)/u/[username]/lists",
              params: {
                username: user.username,
              },
            }}
          >
            <Text
              className={cn("font-medium", {
                "text-primary": segments.at(-1) === "lists",
              })}
            >
              Lists
            </Text>
          </TabTrigger>

          <TabTrigger
            name="favorites"
            href={{
              pathname: "/(app)/u/[username]/favorites",
              params: {
                username: user.username,
              },
            }}
          >
            <Text
              className={cn("font-medium", {
                "text-primary": segments.at(-1) === "favorites",
              })}
            >
              Favorites
            </Text>
          </TabTrigger>

          <TabTrigger
            name="followers"
            href={{
              pathname: "/(app)/u/[username]/followers",
              params: {
                username: user.username,
              },
            }}
            className="hidden"
          ></TabTrigger>

          <TabTrigger
            name="following"
            href={{
              pathname: "/(app)/u/[username]/following",
              params: {
                username: user.username,
              },
            }}
            className="hidden"
          ></TabTrigger>
        </TabList>
        <TabSlot />
      </Tabs>
    </ParallaxScrollView>
  );
}
