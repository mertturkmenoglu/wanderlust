import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { createBookmark, deleteBookmarkByPoiId } from "~/lib/api-requests";
import { cn } from "~/lib/utils";
import { AuthContext } from "~/providers/auth-provider";

type Props = {
  isBookmarked: boolean;
  poiId: string;
};

export default function BookmarkButton({ isBookmarked, poiId }: Props) {
  const [booked, setBooked] = useState(isBookmarked);
  const qc = useQueryClient();
  const auth = useContext(AuthContext);

  const mutation = useMutation({
    mutationKey: ["bookmark", poiId],
    mutationFn: async () => {
      if (booked) {
        await deleteBookmarkByPoiId(poiId);
      } else {
        await createBookmark({ poiId });
      }
    },
    onSuccess: async () => {
      const prev = booked;
      setBooked((prev) => !prev);
      await qc.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(prev ? "Bookmark removed" : "Bookmark added");
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
            <BookmarkIcon
              className={cn("size-6 text-primary", {
                "fill-primary": booked,
              })}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{booked ? "Remove bookmark" : "Add to bookmarks"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
