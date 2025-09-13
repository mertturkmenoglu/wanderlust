import type { components } from "@/api/types";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  poi: components["schemas"]["Poi"];
  className?: string;
};

export function PoiCard({ poi, className }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/p/[id]",
          params: {
            id: poi.id,
          },
        });
      }}
      className={cn(className)}
    >
      <View>
        <Image
          source={{
            uri: poi.images[0].url,
          }}
          style={{
            width: 160,
            aspectRatio: 3 / 2,
            borderRadius: 8,
          }}
          cachePolicy="memory-disk"
        />
        <Text
          className="font-medium mt-1"
          style={{
            width: 160,
          }}
        >
          {poi.name}
        </Text>
        <Text
          className="text-zinc-500 text-sm"
          style={{
            width: 160,
          }}
        >
          {poi.address.city.name}
        </Text>

        <Text
          className="text-primary text-sm"
          style={{
            width: 160,
          }}
        >
          {poi.category.name}
        </Text>
      </View>
    </Pressable>
  );
}
