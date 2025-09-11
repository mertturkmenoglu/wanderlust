import type { components } from "@/api/types";
import { ExternalLink } from "@/components/ui/external-link";
import { Colors } from "@/constants/Colors";
import { useBookmark } from "@/hooks/use-bookmark";
import { useFavorite } from "@/hooks/use-favorite";
import { cn } from "@/lib/utils";
import { useRouter, type ExternalPathString } from "expo-router";
import {
  BookmarkIcon,
  FlagIcon,
  HeartIcon,
  PlusIcon,
  Share2Icon,
} from "lucide-react-native";
import { Alert, Pressable, Share, View } from "react-native";

type Props = {
  poi: components["schemas"]["Poi"];
  meta: components["schemas"]["GetPoiByIdMeta"];
  className?: string;
};

export function PoiActions({ poi, meta, className }: Props) {
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
    <View
      className={cn(
        "flex flex-row items-center justify-between gap-2 bg-primary/5 p-4 rounded-full",
        className
      )}
    >
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
  );
}
