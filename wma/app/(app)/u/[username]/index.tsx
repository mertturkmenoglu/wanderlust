import { api } from "@/api/api";
import { PoiCard } from "@/components/blocks/poi-card";
import { InfoCard } from "@/components/blocks/poi/info-card";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { LeafIcon, LinkIcon, SpeechIcon } from "lucide-react-native";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
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

  return (
    <View>
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
    </View>
  );
}
