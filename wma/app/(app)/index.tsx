import { api } from "@/api/api";
import { PoiCard } from "@/components/blocks/poi-card";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <Suspense fallback={<ActivityIndicator />}>
        <Content />
      </Suspense>
    </SafeAreaView>
  );
}

function Content() {
  const router = useRouter();

  const { data: cities } = api.useSuspenseQuery(
    "get",
    "/api/v2/cities/featured"
  );

  const { data: aggregations } = api.useSuspenseQuery(
    "get",
    "/api/v2/aggregator/home"
  );

  return (
    <ScrollView className="p-4">
      <View className="flex items-baseline flex-row gap-4">
        <Text className="text-2xl font-semibold">Featured Cities</Text>
        <Link href="/(app)/cities" className="text-primary">
          See all
        </Link>
      </View>

      <FlatList
        data={cities.cities}
        className="mt-4"
        contentContainerClassName="gap-4 mb-2"
        renderItem={({ item: city }) => (
          <Pressable
            className="flex flex-1"
            onPress={() => {
              router.push({
                pathname: "/cities/[id]",
                params: {
                  id: city.id,
                },
              });
            }}
          >
            <Image
              source={{
                uri: city.image,
              }}
              style={{
                width: 96,
                aspectRatio: 2 / 3,
                borderRadius: 8,
              }}
              cachePolicy="memory-disk"
            />
            <Text className="font-medium mt-1">{city.name}</Text>
          </Pressable>
        )}
        keyExtractor={(city) => `${city.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">Featured Locations</Text>

      <FlatList
        data={aggregations.featured}
        className="mt-4"
        contentContainerClassName="gap-4 mb-2"
        renderItem={(poi) => <PoiCard poi={poi.item} />}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">Popular Locations</Text>

      <FlatList
        data={aggregations.popular}
        className="mt-4"
        contentContainerClassName="gap-4 mb-2"
        renderItem={(poi) => <PoiCard poi={poi.item} />}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">Favorite Locations</Text>

      <FlatList
        data={aggregations.favorites}
        className="mt-4"
        contentContainerClassName="gap-4 mb-2"
        renderItem={(poi) => <PoiCard poi={poi.item} />}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">New Locations</Text>

      <FlatList
        data={aggregations.new}
        className="mt-4"
        contentContainerClassName="gap-4 mb-2"
        renderItem={(poi) => <PoiCard poi={poi.item} />}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />
    </ScrollView>
  );
}
