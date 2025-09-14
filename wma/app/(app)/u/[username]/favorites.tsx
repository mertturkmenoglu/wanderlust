import { api } from "@/api/api";
import { PoiCard } from "@/components/blocks/poi-card";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Page() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const query = api.useSuspenseQuery("get", "/api/v2/favorites/{username}", {
    params: {
      path: {
        username,
      },
      query: {
        pageSize: 20,
      },
    },
  });

  const favorites = query.data.favorites;

  return (
    <View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.poi.id}
        contentContainerClassName="gap-4"
        renderItem={({ item }) => <PoiCard poi={item.poi} />}
        horizontal={true}
        ListEmptyComponent={<Text>No favorites</Text>}
        className="mt-4"
      />
    </View>
  );
}
