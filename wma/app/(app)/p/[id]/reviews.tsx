import { api } from "@/api/api";
import { FormattedRating } from "@/components/blocks/formatted-rating";
import { Colors } from "@/constants/Colors";
import { blurhash } from "@/lib/image";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
} from "lucide-react-native";
import { Suspense, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewsModal() {
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
  const [page, setPage] = useState(1);
  const flRef = useRef<FlatList<any>>(null);
  const router = useRouter();

  const query = api.useSuspenseQuery("get", "/api/v2/reviews/poi/{id}", {
    params: {
      path: {
        id,
      },
      query: {
        pageSize: 10,
        page,
        maxRating: 5,
        minRating: 0,
        sortBy: "created_at",
        sortOrd: "desc",
      },
    },
  });

  if (query.data.pagination.totalRecords === 0) {
    return (
      <View>
        <Text>No reviews yet.</Text>
      </View>
    );
  }

  return (
    <View>
      <Pressable
        className="bg-primary flex flex-row p-2 items-center justify-center rounded-md m-2 gap-2"
        onPress={() => {
          router.push({
            pathname: "/(app)/p/[id]/add-review",
            params: {
              id,
            },
          });
        }}
      >
        <PencilIcon size={16} color="#ffffff" />
        <Text className="text-white">Add a review</Text>
      </Pressable>
      <FlatList
        data={query.data.reviews}
        ref={flRef}
        renderItem={({ item: review }) => (
          <View className="px-2 py-4">
            <View className="flex flex-row items-start gap-2">
              <Image
                source={{
                  uri: review.user.profileImage ?? "",
                }}
                cachePolicy="memory-disk"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                }}
                placeholder={{ blurhash }}
              />
              <Pressable
                onPress={() => {
                  router.navigate({
                    pathname: "/(app)/u/[username]",
                    params: {
                      username: review.user.username,
                    },
                  });
                }}
              >
                <Text className="font-bold">{review.user.fullName}</Text>
                <Text className="text-sm text-primary">
                  @{review.user.username}
                </Text>
                <Text className="text-xs text-zinc-500">
                  {new Date(review.createdAt).toLocaleString()}
                </Text>
              </Pressable>
            </View>
            <Text className="p-2 text-sm text-zinc-700 mt-2">
              {review.content}
            </Text>
            <FormattedRating
              rating={review.rating}
              showNumbers={false}
              votes={0}
              className="pl-2 mt-2"
            />
            {review.images.length > 0 && (
              <FlatList
                data={review.images}
                contentContainerClassName="gap-2 mt-4 mb-2"
                renderItem={({ item }) => (
                  <Image
                    source={{
                      uri: item.url,
                    }}
                    style={{
                      width: 128,
                      aspectRatio: 16 / 9,
                      borderRadius: 8,
                    }}
                    cachePolicy="memory-disk"
                    placeholder={{ blurhash }}
                  />
                )}
                keyExtractor={(item) => `${item.id}`}
                horizontal={true}
              />
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => (
          <View className="mb-4 flex flex-row items-center justify-center gap-4">
            <Pressable
              disabled={page === 1}
              className="bg-primary disabled:bg-primary/50 rounded-md p-2 flex items-center justify-center"
              onPress={() => {
                setPage((prev) => prev - 1);
                flRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
            >
              <ChevronLeftIcon size={24} color="#ffffff" />
            </Pressable>

            <Text>
              {page} / {query.data.pagination.totalPages}
            </Text>

            <Pressable
              disabled={page === query.data.pagination.totalPages}
              className="bg-primary disabled:bg-primary/50 rounded-md p-2 flex items-center justify-center"
              onPress={() => {
                setPage((prev) => prev + 1);
                flRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
            >
              <ChevronRightIcon size={24} color="#ffffff" />
            </Pressable>
          </View>
        )}
        extraData={[page]}
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
