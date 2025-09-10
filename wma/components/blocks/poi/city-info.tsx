import type { components } from "@/api/types";
import { blurhash } from "@/lib/image";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import { Text, View } from "react-native";

type Props = {
  className?: string;
  poi: components["schemas"]["Poi"];
};

export function PoiCityInfo({ className, poi }: Props) {
  return (
    <View className={cn(className)}>
      <Text className="font-bold text-2xl">{poi.address.city.name}</Text>
      <Text className="text-sm text-zinc-500">
        {poi.address.city.state.name}/{poi.address.city.country.name}
      </Text>
      <Text className="text-zinc-500 mt-2">{poi.address.city.description}</Text>
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
  );
}
