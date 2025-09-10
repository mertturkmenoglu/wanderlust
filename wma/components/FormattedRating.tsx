import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react-native";
import { useId } from "react";
import { Text, View } from "react-native";

type Props = {
  rating: number;
  votes: number;
  starsClassName?: string;
  className?: string;
  showNumbers?: boolean;
};

export function FormattedRating({
  rating,
  votes,
  starsClassName,
  className,
  showNumbers = true,
}: Props) {
  const id = useId();
  const fmt = new Intl.NumberFormat("en-US", {
    style: "decimal",
    compactDisplay: "short",
    notation: "compact",
  });

  const formattedRating = fmt.format(votes);

  return (
    <View className={cn("flex flex-row items-center", className)}>
      {/* Rating */}
      {Array.from({ length: rating })
        .fill(0)
        .map((_, i) => (
          <HeartIcon
            key={`rating-filled-${id}-${i}`}
            color={Colors.light.primary}
            fill={Colors.light.primary}
            size={16}
            className={cn(starsClassName)}
          />
        ))}
      {Array.from({ length: 5 - rating })
        .fill(0)
        .map((_, i) => (
          <HeartIcon
            key={`rating-empty-${id}-${i}`}
            color={Colors.light.primary}
            size={24}
            className={cn(starsClassName)}
          />
        ))}
      {/* End Rating */}
      {showNumbers && (
        <View className="flex items-center space-x-1">
          <Text className="font-bold">{rating.toFixed(1)}</Text>
          <Text>({formattedRating})</Text>
        </View>
      )}
    </View>
  );
}
