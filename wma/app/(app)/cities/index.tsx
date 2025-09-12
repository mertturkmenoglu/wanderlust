import { api } from "@/api/api";
import type { components } from "@/api/types";
import { blurhash } from "@/lib/image";
import { FlashList } from "@shopify/flash-list/src";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      <Suspense fallback={<ActivityIndicator />}>
        <Content />
      </Suspense>
    </SafeAreaView>
  );
}

function Content() {
  const query = api.useSuspenseQuery("get", "/api/v2/cities/");
  const groups = groupCitiesByCountry(query.data.cities);
  const router = useRouter();

  return (
    <View className="">
      <View
        className=""
        style={{
          minHeight: 2,
          height: "100%",
        }}
      >
        <FlashList
          data={groups}
          className="p-4"
          renderItem={({ item }) => {
            if (typeof item === "string") {
              return (
                <View className="">
                  <Text className="text-2xl font-bold">{item}</Text>
                </View>
              );
            }

            return (
              <Pressable
                className="w-full flex flex-row items-center gap-4 my-1 p-2"
                onPress={() => {
                  router.navigate({
                    pathname: "/(app)/cities/[id]",
                    params: {
                      id: `${item.id}`,
                    },
                  });
                }}
              >
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={{
                    height: 96,
                    aspectRatio: 3 / 2,
                    borderRadius: 8,
                  }}
                  cachePolicy="memory-disk"
                  placeholder={{ blurhash }}
                />
                <Text className="font-medium text-xl">{item.name}</Text>
              </Pressable>
            );
          }}
          getItemType={(item) => {
            return typeof item === "string" ? "sectionHeader" : "item";
          }}
          estimatedItemSize={68}
        />
      </View>
    </View>
  );
}

type TCity = components["schemas"]["City"];
type TCities = TCity[];

// TODO: cleanup
export function groupCitiesByCountry(cities: TCities) {
  const countries = new Map<string, TCity[]>();

  for (const city of cities) {
    const country = city.country.name;
    if (!countries.has(country)) {
      countries.set(country, []);
    }
    countries.get(country)?.push(city);
  }

  const countriesArray = [...countries.entries()];
  countriesArray.sort((a, b) => a[0].localeCompare(b[0]));

  const arr: (string | TCity)[] = [];

  for (const el of countriesArray) {
    arr.push(el[0]);
    for (const c of el[1]) {
      arr.push(c);
    }
  }

  return arr;
}
