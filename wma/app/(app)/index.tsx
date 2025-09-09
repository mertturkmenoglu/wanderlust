import { api } from "@/api/api";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  const { data: cities } = api.useSuspenseQuery(
    "get",
    "/api/v2/cities/featured"
  );

  const { data: aggregations } = api.useSuspenseQuery(
    "get",
    "/api/v2/aggregator/home"
  );

  return (
    <ScrollView
      className="p-4"
      style={{
        flexGrow: 0,
      }}
    >
      <View className="flex items-baseline flex-row gap-4">
        <Text className="text-2xl font-semibold">Featured Cities</Text>
        <Link href="/(app)/search" className="text-primary">
          See all
        </Link>
      </View>

      <FlatList
        data={cities.cities}
        className="mt-4"
        contentContainerClassName="gap-4"
        renderItem={(city) => (
          <Link href="/search" className="mb-2">
            <View>
              <Image
                source={{
                  uri: city.item.image,
                }}
                style={{
                  width: 96,
                  aspectRatio: 2 / 3,
                  borderRadius: 8,
                }}
              />
              <Text className="font-medium mt-1">{city.item.name}</Text>
            </View>
          </Link>
        )}
        keyExtractor={(city) => `${city.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">Featured Locations</Text>

      <FlatList
        data={aggregations.featured}
        className="mt-4"
        contentContainerClassName="gap-4"
        renderItem={(poi) => (
          <Link href="/search" className="mb-2">
            <View>
              <Image
                source={{
                  uri: poi.item.images[0].url,
                }}
                style={{
                  width: 160,
                  aspectRatio: 3 / 2,
                  borderRadius: 8,
                }}
              />
              <Text
                className="font-medium mt-1"
                style={{
                  width: 160,
                }}
              >
                {poi.item.name}
              </Text>
              <Text
                className="text-zinc-500 text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.address.city.name}
              </Text>

              <Text
                className="text-primary text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.category.name}
              </Text>
            </View>
          </Link>
        )}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">Popular Locations</Text>

      <FlatList
        data={aggregations.popular}
        className="mt-4"
        contentContainerClassName="gap-4"
        renderItem={(poi) => (
          <Link href="/search" className="mb-2">
            <View>
              <Image
                source={{
                  uri: poi.item.images[0].url,
                }}
                style={{
                  width: 160,
                  aspectRatio: 3 / 2,
                  borderRadius: 8,
                }}
              />
              <Text
                className="font-medium mt-1"
                style={{
                  width: 160,
                }}
              >
                {poi.item.name}
              </Text>
              <Text
                className="text-zinc-500 text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.address.city.name}
              </Text>

              <Text
                className="text-primary text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.category.name}
              </Text>
            </View>
          </Link>
        )}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">Favorite Locations</Text>

      <FlatList
        data={aggregations.favorites}
        className="mt-4"
        contentContainerClassName="gap-4"
        renderItem={(poi) => (
          <Link href="/search" className="mb-2">
            <View>
              <Image
                source={{
                  uri: poi.item.images[0].url,
                }}
                style={{
                  width: 160,
                  aspectRatio: 3 / 2,
                  borderRadius: 8,
                }}
              />
              <Text
                className="font-medium mt-1"
                style={{
                  width: 160,
                }}
              >
                {poi.item.name}
              </Text>
              <Text
                className="text-zinc-500 text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.address.city.name}
              </Text>

              <Text
                className="text-primary text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.category.name}
              </Text>
            </View>
          </Link>
        )}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />

      <Text className="text-2xl font-semibold mt-4">New Locations</Text>

      <FlatList
        data={aggregations.new}
        className="mt-4"
        contentContainerClassName="gap-4"
        renderItem={(poi) => (
          <Link href="/search" className="mb-2">
            <View>
              <Image
                source={{
                  uri: poi.item.images[0].url,
                }}
                style={{
                  width: 160,
                  aspectRatio: 3 / 2,
                  borderRadius: 8,
                }}
              />
              <Text
                className="font-medium mt-1"
                style={{
                  width: 160,
                }}
              >
                {poi.item.name}
              </Text>
              <Text
                className="text-zinc-500 text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.address.city.name}
              </Text>

              <Text
                className="text-primary text-sm"
                style={{
                  width: 160,
                }}
              >
                {poi.item.category.name}
              </Text>
            </View>
          </Link>
        )}
        keyExtractor={(poi) => `${poi.id}`}
        horizontal={true}
      />
    </ScrollView>
  );
}
