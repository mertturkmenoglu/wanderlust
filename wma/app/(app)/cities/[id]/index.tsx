import { api } from "@/api/api";
import ParallaxScrollView from "@/components/ui/parallax-scroll-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { TagNavigation } from "@/components/blocks/tag-navigation";
import { blurhash } from "@/lib/image";
import { tileUrl } from "@/lib/map";
import { Image } from "expo-image";
import MapView, { UrlTile } from "react-native-maps";

export default function Page() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const query = api.useSuspenseQuery("get", "/api/v2/cities/{id}", {
    params: {
      path: {
        id: +id,
      },
    },
  });

  const collectionsQuery = api.useSuspenseQuery(
    "get",
    "/api/v2/collections/city/{id}",
    {
      params: {
        path: {
          id: +id,
        },
      },
    }
  );

  const city = query.data;
  const collections = collectionsQuery.data.collections;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: city.image,
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
      <View className="flex gap-2">
        <Text className="font-bold text-4xl">{city.name}</Text>

        <Text className="text-primary">
          {city.state.name} / {city.country.name}
        </Text>
      </View>

      <Text className="text-sm text-zinc-500 mt-4">{city.description}</Text>

      <MapView
        region={{
          latitude: city.coordinates.latitude,
          longitude: city.coordinates.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        style={{
          width: "100%",
          height: 256,
          marginTop: 16,
        }}
        scrollDuringRotateOrZoomEnabled={false}
        scrollEnabled={false}
      >
        <UrlTile urlTemplate={tileUrl} maximumZ={19} flipY={false} />
      </MapView>

      <Text className="mt-4 text-lg font-medium">Discover {city.name}</Text>
      <TagNavigation className="my-4" />

      {collections.map((collection) => (
        <View key={collection.id}>
          <Text className="text-2xl font-bold">{collection.name}</Text>
          <FlatList
            data={collection.items}
            contentContainerClassName="gap-4 mb-4 mt-2"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  router.navigate({
                    pathname: "/(app)/p/[id]",
                    params: {
                      id: item.poiId,
                    },
                  });
                }}
              >
                <Image
                  source={{
                    uri: item.poi.images[0].url,
                  }}
                  style={{
                    width: 160,
                    aspectRatio: 3 / 2,
                    borderRadius: 8,
                  }}
                  placeholder={{
                    blurhash,
                  }}
                  cachePolicy="memory-disk"
                />

                <Text
                  className="font-medium mt-1"
                  style={{
                    width: 160,
                  }}
                >
                  {item.poi.name}
                </Text>
                <Text
                  className="text-zinc-500 text-sm"
                  style={{
                    width: 160,
                  }}
                >
                  {item.poi.address.city.name}
                </Text>

                <Text
                  className="text-primary text-sm"
                  style={{
                    width: 160,
                  }}
                >
                  {item.poi.category.name}
                </Text>
              </Pressable>
            )}
            horizontal={true}
          />
        </View>
      ))}
    </ParallaxScrollView>
  );
}
