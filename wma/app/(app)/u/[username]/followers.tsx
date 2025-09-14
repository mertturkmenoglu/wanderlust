import { api } from "@/api/api";
import { blurhash } from "@/lib/image";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  const query = api.useSuspenseQuery(
    "get",
    "/api/v2/users/{username}/followers",
    {
      params: {
        path: {
          username,
        },
      },
    }
  );

  const followers = query.data.followers;

  const router = useRouter();

  return (
    <View>
      <FlatList
        data={followers}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 mb-2"
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              router.navigate({
                pathname: "/(app)/u/[username]",
                params: {
                  username: item.username,
                },
              });
            }}
          >
            <Image
              source={
                item.profileImage !== null
                  ? { uri: item.profileImage }
                  : require("@/assets/images/profile.png")
              }
              style={{
                width: 96,
                aspectRatio: 2 / 3,
                borderRadius: 8,
              }}
              cachePolicy="memory-disk"
              placeholder={{ blurhash }}
              contentFit="cover"
            />
            <Text
              style={{
                width: 96,
              }}
            >
              {item.fullName}
            </Text>
          </Pressable>
        )}
        horizontal={true}
        ListEmptyComponent={<Text>No followers</Text>}
        className="mt-4"
      />
    </View>
  );
}
