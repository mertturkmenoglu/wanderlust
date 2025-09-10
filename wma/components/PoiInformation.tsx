/* eslint-disable @typescript-eslint/no-unused-vars */
import type { components } from "@/api/types";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react-native";
import { Text, View } from "react-native";

type Props = {
  className?: string;
  poi: components["schemas"]["Poi"];
};

function useWebsiteHostname(s: string): [string, boolean] {
  try {
    const url = new URL(s);
    return [url.hostname, true];
  } catch (error) {
    return ["", false];
  }
}

export function PoiInformation({ className, poi }: Props) {
  const [host, ok] = useWebsiteHostname(poi.website ?? "");

  return (
    <View className={cn(className)}>
      <Text className="text-xl font-semibold tracking-tight">Information</Text>
      <View className="flex flex-row flex-wrap gap-2 mt-4 justify-between w-full">
        <Text className="font-medium w-[48%]">Address</Text>
        <View className="w-[48%]">
          <Text className="text-right text-zinc-500 text-sm">
            {poi.address.line1} {poi.address.line2}
          </Text>

          <Text className="text-right text-zinc-500 text-sm">
            {poi.address.city.name}, {poi.address.city.state.name} /{" "}
            {poi.address.city.country.name}
          </Text>

          <Text className="text-right text-zinc-500 text-sm">
            {poi.address.postalCode}
          </Text>
        </View>

        {poi.phone && (
          <>
            <Text className="font-medium w-[48%]">Phone</Text>
            <View className="w-[48%]">
              <Text className="text-right text-zinc-500 text-sm">
                {poi.phone}
              </Text>
            </View>
          </>
        )}

        {poi.website && ok && (
          <>
            <Text className="font-medium w-[48%]">Website</Text>
            <View className="w-[48%]">
              <View className="flex items-center gap-1 flex-row justify-end">
                <Text className="text-primary text-sm">{host}</Text>
                <ExternalLinkIcon size={12} />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
