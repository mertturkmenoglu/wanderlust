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
import { cn } from "~/lib/utils";
import { AuthContext } from "~/providers/auth-provider";

type Props = {
  isFavorite: boolean;
  poiId: string;
};

export default function FavoriteButton({ isFavorite, poiId }: Props) {
  const [fav, setFav] = useState(isFavorite);
  const { isSignedIn } = useContext(AuthContext);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["favorites", poiId],
    mutationFn: async () => {
      // TODO: Implement later
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
              if (!isSignedIn) {
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