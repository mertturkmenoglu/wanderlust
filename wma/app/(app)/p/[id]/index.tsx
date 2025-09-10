import { api } from "@/api/api";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text } from "react-native";
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
        />
      }
    >
      <ThemedView className="flex flex-row gap-2">
        <Text className="font-bold text-4xl">{query.data.poi.name}</Text>
      </ThemedView>
      <Text className="text-primary">{query.data.poi.category.name}</Text>
    </ParallaxScrollView>
  );
}
