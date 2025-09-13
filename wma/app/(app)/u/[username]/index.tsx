import { api } from "@/api/api";
import { PoiCard } from "@/components/blocks/poi-card";
import { InfoCard } from "@/components/blocks/poi/info-card";
import ParallaxScrollView from "@/components/ui/parallax-scroll-view";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/hooks/use-user";
import { blurhash } from "@/lib/image";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { LeafIcon, LinkIcon, SpeechIcon } from "lucide-react-native";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";

export default function Page() {
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
  const favoritesQuery = api.useSuspenseQuery(
    "get",
    "/api/v2/users/{username}/top",
    {
      params: {
        path: {
          username,
        },
      },
    }
  );

  const user = query.data.profile;
  const favoriteLocations = favoritesQuery.data.pois;
  const meta = query.data.meta;
  const router = useRouter();
  const thisUser = useUser();
  const isThisUser = thisUser.username === user.username;
  const qc = useQueryClient();

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

      <View
        className={cn("flex flex-row flex-wrap gap-2 w-full mt-4 max-h-56")}
      >
        <InfoCard.Root className="w-[48%] h-min">
          <Pressable
            className=""
            onPress={() => {}}
            android_ripple={{
              radius: 100,
            }}
          >
            <InfoCard.Content>
              <InfoCard.NumberColumn>
                <Text className="font-bold text-3xl md:text-6xl text-primary">
                  {user.followersCount}
                </Text>
              </InfoCard.NumberColumn>
              <InfoCard.DescriptionColumn>
                <Text className="text-sm text-primary tracking-tight">
                  Followers
                </Text>
              </InfoCard.DescriptionColumn>
            </InfoCard.Content>
          </Pressable>
        </InfoCard.Root>

        <InfoCard.Root className="w-[48%] h-min">
          <Pressable
            className=""
            onPress={() => {}}
            android_ripple={{
              radius: 100,
            }}
          >
            <InfoCard.Content>
              <InfoCard.NumberColumn>
                <Text className="font-bold text-3xl md:text-6xl text-primary">
                  {user.followingCount}
                </Text>
              </InfoCard.NumberColumn>
              <InfoCard.DescriptionColumn>
                <Text className="text-sm text-primary tracking-tight">
                  Following
                </Text>
              </InfoCard.DescriptionColumn>
            </InfoCard.Content>
          </Pressable>
        </InfoCard.Root>

        <InfoCard.Root className="w-[48%] h-min">
          <Pressable
            className=""
            onPress={() => {}}
            android_ripple={{
              radius: 100,
            }}
          >
            <InfoCard.Content>
              <InfoCard.NumberColumn>
                <LeafIcon size={16} color={Colors.light.primary} />
              </InfoCard.NumberColumn>
              <InfoCard.DescriptionColumn>
                <Text className="text-sm text-primary tracking-tight">
                  Joined
                </Text>
                <Text className="text-xs text-zinc-500 tracking-tight">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </InfoCard.DescriptionColumn>
            </InfoCard.Content>
          </Pressable>
        </InfoCard.Root>

        {user.pronouns !== null && (
          <InfoCard.Root className="w-[48%] h-min">
            <Pressable
              className=""
              onPress={() => {}}
              android_ripple={{
                radius: 100,
              }}
            >
              <InfoCard.Content>
                <InfoCard.NumberColumn>
                  <SpeechIcon size={16} color={Colors.light.primary} />
                </InfoCard.NumberColumn>
                <InfoCard.DescriptionColumn>
                  <Text className="text-sm text-primary tracking-tight">
                    Pronouns
                  </Text>
                  <Text className="text-xs text-zinc-500 tracking-tight">
                    {user.pronouns}
                  </Text>
                </InfoCard.DescriptionColumn>
              </InfoCard.Content>
            </Pressable>
          </InfoCard.Root>
        )}

        {user.website !== null && (
          <InfoCard.Root className="w-[48%] h-min">
            <Pressable
              className=""
              onPress={async (ev) => {
                if (Platform.OS !== "web") {
                  // Prevent the default behavior of linking to the default browser on native.
                  ev.preventDefault();
                  // Open the link in an in-app browser.
                  await openBrowserAsync(user.website!);
                }
              }}
              android_ripple={{
                radius: 100,
              }}
            >
              <InfoCard.Content>
                <InfoCard.NumberColumn>
                  <LinkIcon size={16} color={Colors.light.primary} />
                </InfoCard.NumberColumn>
                <InfoCard.DescriptionColumn>
                  <Text className="text-sm text-primary tracking-tight">
                    Website
                  </Text>
                  <Text className="text-xs text-zinc-500 tracking-tight">
                    Go to website
                  </Text>
                </InfoCard.DescriptionColumn>
              </InfoCard.Content>
            </Pressable>
          </InfoCard.Root>
        )}
      </View>

      <View className="mt-4">
        <Text className="font-bold text-xl">Favorite Locations</Text>
        <FlatList
          data={favoriteLocations}
          keyExtractor={(item) => item.id}
          className="mt-4"
          renderItem={({ item }) => <PoiCard poi={item} />}
          horizontal={true}
          ListEmptyComponent={<Text>No favorite locations</Text>}
        />
      </View>
    </ParallaxScrollView>
  );
}
