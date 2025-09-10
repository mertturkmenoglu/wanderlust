import { api } from "@/api/api";
import { FormattedRating } from "@/components/FormattedRating";
import { InfoCard } from "@/components/InfoCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { tileUrl } from "@/lib/map";
import { computeRating } from "@/lib/rating";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import {
  BookmarkIcon,
  DollarSignIcon,
  FlagIcon,
  HeartIcon,
  MapIcon,
  PersonStandingIcon,
  PlusIcon,
  Share2Icon,
} from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = api.useQuery("get", "/api/v2/pois/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  if (query.isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (query.isError) {
    return (
      <SafeAreaView>
        <Text>Error</Text>
      </SafeAreaView>
    );
  }

  if (!query.data) {
    return (
      <SafeAreaView>
        <Text>Not found</Text>
      </SafeAreaView>
    );
  }

  const poi = query.data.poi;

  const rating = computeRating(poi.totalPoints, poi.totalVotes);
  const fmt = Intl.NumberFormat("en-US", {
    style: "decimal",
    compactDisplay: "short",
    notation: "compact",
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: query.data.poi.images[0].url,
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
      <ThemedView className="flex flex-row gap-2">
        <Text className="font-bold text-4xl">{poi.name}</Text>
      </ThemedView>

      <View className="flex flex-row items-start gap-2 justify-between mt-4">
        <Text className="text-primary">{poi.category.name}</Text>
        <View>
          <Text className="text-zinc-500 text-sm text-right">
            {poi.address.city.name}
          </Text>
          <Text className="text-zinc-500 text-sm text-right">
            {poi.address.city.country.name}
          </Text>
        </View>
      </View>

      <FlatList
        data={poi.images}
        className="mt-4"
        contentContainerClassName="gap-4 mb-2"
        renderItem={({ item: img }) => (
          <Pressable
            className="flex flex-1"
            onPress={() => {
              // TODO: Carousel for images
            }}
          >
            <Image
              source={{
                uri: img.url,
              }}
              style={{
                width: 128,
                aspectRatio: 16 / 9,
                borderRadius: 8,
              }}
              cachePolicy="memory-disk"
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </Pressable>
        )}
        keyExtractor={(image) => `${image.id}`}
        horizontal={true}
      />

      <View className="flex flex-row flex-wrap gap-2 mt-4 w-full h-36">
        <InfoCard.Root className="w-[48%] h-min">
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              <Text className="font-bold text-3xl md:text-6xl text-primary">
                {computeRating(poi.totalPoints, poi.totalVotes)}
              </Text>
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <FormattedRating
                rating={Number.parseFloat(rating)}
                votes={poi.totalVotes}
                showNumbers={false}
              />
              <Text className="text-xs text-zinc-500 tracking-tight">
                {fmt.format(poi.totalVotes)} reviews
              </Text>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>

        <InfoCard.Root className="w-[48%] h-min">
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              <Text className="font-bold text-3xl md:text-6xl text-primary">
                {fmt.format(poi.totalFavorites)}
              </Text>
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <View className="flex flex-row items-center gap-1">
                <HeartIcon
                  color={Colors.light.primary}
                  fill={Colors.light.primary}
                  size={16}
                />
                <HeartIcon
                  color={Colors.light.primary}
                  fill={Colors.light.primary}
                  size={16}
                />
                <HeartIcon
                  color={Colors.light.primary}
                  fill={Colors.light.primary}
                  size={16}
                />
              </View>
              <Text className="text-xs text-zinc-500 tracking-tight">
                Favorites
              </Text>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>

        <InfoCard.Root className="w-[48%] h-min">
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              <Text className="font-bold text-3xl md:text-6xl text-primary">
                {poi.priceLevel}/5
              </Text>
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <View className="flex flex-row items-center">
                {Array.from({ length: poi.priceLevel }).map((_, i) => (
                  <DollarSignIcon
                    size={16}
                    color={Colors.light.primary}
                    key={i}
                  />
                ))}
              </View>

              <Text className="text-xs text-zinc-500 tracking-tight">
                Price Level
              </Text>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>

        <InfoCard.Root className="w-[48%] h-min">
          <InfoCard.Content>
            <InfoCard.NumberColumn>
              <Text className="font-bold text-3xl md:text-6xl text-primary">
                {poi.accessibilityLevel}/5
              </Text>
            </InfoCard.NumberColumn>
            <InfoCard.DescriptionColumn>
              <View className="flex flex-row items-center">
                {Array.from({ length: poi.accessibilityLevel }).map((_, i) => (
                  <PersonStandingIcon
                    size={16}
                    color={Colors.light.primary}
                    key={i}
                  />
                ))}
              </View>

              <Text className="text-xs text-zinc-500 tracking-tight">
                Accessibility{" "}
                <Text className="sr-only md:not-sr-only">Level</Text>
              </Text>
            </InfoCard.DescriptionColumn>
          </InfoCard.Content>
        </InfoCard.Root>
      </View>

      <View className="flex flex-row items-center justify-between gap-2 mt-4 bg-primary/5 p-4 rounded-full">
        <Pressable>
          <PlusIcon size={24} color={Colors.light.primary} />
        </Pressable>
        <Pressable>
          <HeartIcon size={24} color={Colors.light.primary} />
        </Pressable>
        <Pressable>
          <BookmarkIcon size={24} color={Colors.light.primary} />
        </Pressable>
        <Pressable>
          <Share2Icon size={24} color={Colors.light.primary} />
        </Pressable>
        <Pressable>
          <FlagIcon size={24} color={Colors.light.primary} />
        </Pressable>
      </View>

      <Text className="font-bold text-xl mt-4">Description</Text>
      <Text className="text-sm text-zinc-500 mt-2">{poi.description}</Text>

      <Pressable className="bg-primary rounded-md p-2 mt-4 flex flex-row justify-center items-center gap-2">
        <MapIcon size={24} color={Colors.light.background} />
        <Text className="text-white">Plan a trip</Text>
      </Pressable>

      <MapView
        region={{
          latitude: poi.address.lat,
          longitude: poi.address.lng,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
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
        <Marker
          coordinate={{ latitude: poi.address.lat, longitude: poi.address.lng }}
          title={poi.name}
          titleVisibility="visible"
        />
      </MapView>

      <View className="mt-4">
        <Text className="font-bold text-2xl">{poi.address.city.name}</Text>
        <Text className="text-sm text-zinc-500">
          {poi.address.city.state.name}/{poi.address.city.country.name}
        </Text>
        <Text className="text-zinc-500 mt-2">
          {poi.address.city.description}
        </Text>
        <Image
          source={{
            uri: poi.address.city.image,
          }}
          style={{
            width: "100%",
            aspectRatio: 3 / 2,
            marginTop: 16,
          }}
          contentFit="cover"
          placeholder={{
            blurhash,
          }}
          cachePolicy="memory-disk"
        />
      </View>
    </ParallaxScrollView>
  );
}
