import { useLoaderData } from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { createFavorite, deleteFavoriteByPoiId } from "~/lib/api-requests";
import { cn } from "~/lib/utils";
import { AuthContext } from "~/providers/auth-provider";
import { loader } from "../route";

export default function FavoriteButton() {
  const { poi, meta } = useLoaderData<typeof loader>();
  const [fav, setFav] = useState(meta.isFavorite);
  const auth = useContext(AuthContext);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["favorites", poi.id],
    mutationFn: async () => {
      if (fav) {
        await deleteFavoriteByPoiId(poi.id);
      } else {
        await createFavorite({ poiId: poi.id });
      }
    },
    onSuccess: async () => {
      const prev = fav;
      setFav((prev) => !prev);
      await qc.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(prev ? "Removed from favorites" : "Added to favorites");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => {
              if (!auth.user) {
                toast.warning("You need to be signed in.");
                return;
              }

              mutation.mutate();
            }}
          >
            <Heart
              className={cn("size-6 text-primary", {
                "fill-primary": fav,
              })}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{fav ? "Remove favorite" : "Add to favorites"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
