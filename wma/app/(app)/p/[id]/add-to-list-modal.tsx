import { api } from "@/api/api";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { CheckIcon } from "lucide-react-native";
import { Suspense } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddToListModal() {
  return (
    <SafeAreaView edges={["left", "right"]}>
      <Suspense fallback={<ActivityIndicator />}>
        <Content />
      </Suspense>
    </SafeAreaView>
  );
}

function Content() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();

  const query = api.useSuspenseQuery("get", "/api/v2/lists/status/{poiId}", {
    params: {
      path: {
        poiId: id,
      },
    },
  });

  const mutation = api.useMutation("post", "/api/v2/lists/{id}/items", {
    onSuccess: async () => {
      await qc.invalidateQueries();
      ToastAndroid.show("Added to the list", ToastAndroid.SHORT);
    },
  });

  return (
    <View className="p-4">
      <FlatList
        data={query.data.statuses}
        contentContainerClassName=""
        renderItem={({ item }) => (
          <Pressable
            className={cn(
              "py-4 rounded-md flex flex-row items-center justify-between gap-2"
            )}
            disabled={item.includes}
            onPress={() => {
              mutation.mutate({
                params: {
                  path: {
                    id: item.id,
                  },
                },
                body: {
                  poiId: id,
                },
              });
            }}
          >
            <Text
              className={cn({
                "text-zinc-500": item.includes,
              })}
            >
              {item.name}
            </Text>
            {item.includes && (
              <CheckIcon size={24} color={Colors.light.primary} />
            )}
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <Text className="font-bold text-lg">Select a list</Text>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.light.text,
            }}
          />
        )}
      />
    </View>
  );
}
