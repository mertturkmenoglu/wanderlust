import type { components } from "@/api/types";
import { FormattedRating } from "@/components/blocks/formatted-rating";
import { InfoCard } from "@/components/blocks/poi/info-card";
import { Colors } from "@/constants/Colors";
import { computeRating } from "@/lib/rating";
import { cn } from "@/lib/utils";
import {
  DollarSignIcon,
  HeartIcon,
  PersonStandingIcon,
} from "lucide-react-native";
import { Text, View } from "react-native";

type Props = {
  className?: string;
  poi: components["schemas"]["Poi"];
};

export function PoiCards({ className, poi }: Props) {
  const rating = computeRating(poi.totalPoints, poi.totalVotes);
  const fmt = Intl.NumberFormat("en-US", {
    style: "decimal",
    compactDisplay: "short",
    notation: "compact",
  });

  return (
    <View
      className={cn("flex flex-row flex-wrap gap-2 w-full h-36", className)}
    >
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
  );
}
