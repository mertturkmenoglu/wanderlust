import { api, fetchClient } from "@/api/api";
import { Colors } from "@/constants/Colors";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PencilIcon, StarIcon } from "lucide-react-native";
import { Suspense, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddReivewModal() {
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
  const router = useRouter();
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const qc = useQueryClient();

  const query = api.useSuspenseQuery("get", "/api/v2/pois/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  const createReviewMutation = api.useMutation("post", "/api/v2/reviews/", {
    onSuccess: async () => {
      await qc.invalidateQueries();
      setText("");
      setRating(0);
      router.navigate({
        pathname: "/(app)/p/[id]",
        params: {
          id,
        },
      });
      ToastAndroid.show("Review added", ToastAndroid.SHORT);
    },
  });

  return (
    <View className="m-2">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text className="text-lg mt-8">
            Add a review to {query.data.poi.name}
          </Text>
          <Text className="font-bold mt-4">Review</Text>
          <TextInput
            className="border border-zinc-400 rounded-md p-2 mt-2 min-h-16"
            multiline={true}
            numberOfLines={4}
            maxLength={2048}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="Leave a review"
            value={text}
            onChangeText={setText}
            enablesReturnKeyAutomatically
          />

          <View className="flex flex-row items-center justify-center gap-1 my-8">
            <Pressable onPress={() => setRating(1)}>
              <StarIcon
                size={32}
                color={Colors.light.primary}
                fill={
                  rating > 0 ? Colors.light.primary : Colors.light.background
                }
              />
            </Pressable>

            <Pressable onPress={() => setRating(2)}>
              <StarIcon
                size={32}
                color={Colors.light.primary}
                fill={
                  rating > 1 ? Colors.light.primary : Colors.light.background
                }
              />
            </Pressable>

            <Pressable onPress={() => setRating(3)}>
              <StarIcon
                size={32}
                color={Colors.light.primary}
                fill={
                  rating > 2 ? Colors.light.primary : Colors.light.background
                }
              />
            </Pressable>

            <Pressable onPress={() => setRating(4)}>
              <StarIcon
                size={32}
                color={Colors.light.primary}
                fill={
                  rating > 3 ? Colors.light.primary : Colors.light.background
                }
              />
            </Pressable>

            <Pressable onPress={() => setRating(5)}>
              <StarIcon
                size={32}
                color={Colors.light.primary}
                fill={
                  rating > 4 ? Colors.light.primary : Colors.light.background
                }
              />
            </Pressable>
          </View>

          <Pressable
            className="bg-primary flex flex-row p-2 items-center justify-center rounded-md gap-2 disabled:bg-primary/80"
            onPress={async () => {
              // Ensure the user is logged in
              const res = await fetchClient.POST("/api/v2/auth/refresh");

              if (res.error) {
                ToastAndroid.show(
                  "You must be logged in to create a review",
                  ToastAndroid.SHORT
                );
                return;
              }

              createReviewMutation.mutate({
                body: {
                  content: text,
                  poiId: query.data.poi.id,
                  rating: rating,
                },
              });
            }}
            disabled={rating === 0 || text.length < 5 || text.length > 2048}
          >
            <PencilIcon size={16} color="#ffffff" />
            <Text className="text-white">Add a review</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
