import { api } from "@/api/api";
import type { components } from "@/api/types";
import { Amenities } from "@/components/blocks/poi/amenity";
import { PoiCards } from "@/components/blocks/poi/cards";
import { PoiCityInfo } from "@/components/blocks/poi/city-info";
import { PoiInformation } from "@/components/blocks/poi/information";
import { PoiMap } from "@/components/blocks/poi/map";
import { ExternalLink } from "@/components/ui/external-link";
import ParallaxScrollView from "@/components/ui/parallax-scroll-view";
import { Colors } from "@/constants/Colors";
import { useBookmark } from "@/hooks/use-bookmark";
import { useFavorite } from "@/hooks/use-favorite";
import { blurhash } from "@/lib/image";
import { Image } from "expo-image";
import {
  useLocalSearchParams,
  useRouter,
  type ExternalPathString,
} from "expo-router";
import {
  BookmarkIcon,
  FlagIcon,
  HeartIcon,
  MapIcon,
  PlusIcon,
  Share2Icon,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return <Content poi={query.data.poi} meta={query.data.meta} />;
}

type ContentProps = {
  poi: components["schemas"]["Poi"];
  meta: components["schemas"]["GetPoiByIdMeta"];
};

function Content({ poi, meta }: ContentProps) {
  const router = useRouter();

  const onShare = async () => {
    try {
      const webUrl = process.env.EXPO_PUBLIC_WEB_URL;
      await Share.share({
        message: `See ${poi.name} on Wanderlust: ${webUrl}/p/${poi.id}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const reportUrl =
    `${process.env.EXPO_PUBLIC_WEB_URL}/report?id="${poi.id}"&type=poi` as unknown as ExternalPathString;

  const { status: bookmarkStatus, onPress: onBookmarkPress } = useBookmark({
    id: poi.id,
    initial: meta.isBookmarked,
  });

  const { status: favoriteStatus, onPress: onFavoritePress } = useFavorite({
    id: poi.id,
    initial: meta.isFavorite,
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: poi.images[0].url,
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
      <View className="flex flex-row gap-2">
        <Text className="font-bold text-4xl">{poi.name}</Text>
      </View>

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

      <PoiCards className="mt-4" poi={poi} />

      <View className="flex flex-row items-center justify-between gap-2 mt-4 bg-primary/5 p-4 rounded-full">
        <Pressable
          accessibilityLabel="Add to list"
          onPress={() => {
            router.push({
              pathname: "/(app)/p/[id]/add-to-list-modal",
              params: {
                id: poi.id,
              },
            });
          }}
        >
          <PlusIcon size={24} color={Colors.light.primary} />
        </Pressable>
        <Pressable onPress={onFavoritePress}>
          <HeartIcon
            size={24}
            color={Colors.light.primary}
            {...(favoriteStatus && {
              fill: Colors.light.primary,
            })}
          />
        </Pressable>
        <Pressable onPress={onBookmarkPress}>
          <BookmarkIcon
            size={24}
            color={Colors.light.primary}
            {...(bookmarkStatus && {
              fill: Colors.light.primary,
            })}
          />
        </Pressable>
        <Pressable onPress={onShare}>
          <Share2Icon size={24} color={Colors.light.primary} />
        </Pressable>
        <ExternalLink href={reportUrl} className="">
          <FlagIcon size={24} color={Colors.light.primary} />
        </ExternalLink>
      </View>

      <Text className="font-bold text-xl mt-4">Description</Text>
      <Text className="text-sm text-zinc-500 mt-2">{poi.description}</Text>

      <Pressable className="bg-primary rounded-md p-2 mt-4 flex flex-row justify-center items-center gap-2">
        <MapIcon size={24} color={Colors.light.background} />
        <Text className="text-white">Plan a trip</Text>
      </Pressable>

      <PoiMap poi={poi} />

      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: Colors.light.text,
          marginTop: 16,
        }}
      />

      <Amenities amenities={poi.amenities} className="mt-4" />

      <PoiInformation poi={poi} className="mt-4" />

      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: Colors.light.text,
          marginTop: 16,
        }}
      />

      <PoiCityInfo className="mt-4" poi={poi} />
    </ParallaxScrollView>
  );
}
