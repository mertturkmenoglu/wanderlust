import { api } from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastAndroid } from "react-native";

type Options = {
  id: string;
  initial: boolean;
};

export function useBookmark({ id, initial }: Options) {
  const qc = useQueryClient();
  const [booked, setBooked] = useState(initial);

  const createBookmarkMutation = api.useMutation("post", "/api/v2/bookmarks/", {
    onSuccess: async () => {
      setBooked((prev) => !prev);
      await qc.invalidateQueries();
      ToastAndroid.show("Bookmark added", ToastAndroid.SHORT);
    },
  });

  const deleteBookmarkMutation = api.useMutation(
    "delete",
    "/api/v2/bookmarks/{id}",
    {
      onSuccess: async () => {
        setBooked((prev) => !prev);
        await qc.invalidateQueries();
        ToastAndroid.show("Bookmark removed", ToastAndroid.SHORT);
      },
    }
  );

  const onBookmarkPress = () => {
    if (booked) {
      deleteBookmarkMutation.mutate({
        params: {
          path: {
            id,
          },
        },
      });

      return;
    }

    createBookmarkMutation.mutate({
      body: {
        poiId: id,
      },
    });
  };

  return { status: booked, onPress: onBookmarkPress };
}
