import { api } from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastAndroid } from "react-native";

type Options = {
  id: string;
  initial: boolean;
};

export function useFavorite({ id, initial }: Options) {
  const qc = useQueryClient();
  const [favorite, setFavorite] = useState(initial);

  const createFavoriteMutation = api.useMutation("post", "/api/v2/favorites/", {
    onSuccess: async () => {
      setFavorite((prev) => !prev);
      await qc.invalidateQueries();
      ToastAndroid.show("Favorite added", ToastAndroid.SHORT);
    },
  });

  const deleteFavoriteMutation = api.useMutation(
    "delete",
    "/api/v2/favorites/{id}",
    {
      onSuccess: async () => {
        setFavorite((prev) => !prev);
        await qc.invalidateQueries();
        ToastAndroid.show("Favorite removed", ToastAndroid.SHORT);
      },
    }
  );

  const onFavoritePress = () => {
    if (favorite) {
      deleteFavoriteMutation.mutate({
        params: {
          path: {
            id,
          },
        },
      });

      return;
    }

    createFavoriteMutation.mutate({
      body: {
        poiId: id,
      },
    });
  };

  return { status: favorite, onPress: onFavoritePress };
}
