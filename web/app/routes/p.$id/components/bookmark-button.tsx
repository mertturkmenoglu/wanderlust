import { useLoaderData } from "@remix-run/react";
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
import { loader } from "../route";

export default function BookmarkButton() {
  const { poi, meta } = useLoaderData<typeof loader>();
  const [booked, setBooked] = useState(meta.isBookmarked);
  const qc = useQueryClient();
  const auth = useContext(AuthContext);

  const onClick = () => {
    if (!auth.user) {
      toast.warning("You need to be signed in.");
      return;
    }

    mutation.mutate();
  };

  const mutation = useMutation({
    mutationKey: ["bookmark", poi.id],
    mutationFn: async () => {
      if (booked) {
        await deleteBookmarkByPoiId(poi.id);
      } else {
        await createBookmark({ poiId: poi.id });
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
          <Button variant="ghost" onClick={onClick}>
            <BookmarkIcon
              className={cn("size-6 text-primary", {
                "fill-primary": booked,
              })}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div>{booked ? "Remove bookmark" : "Add to bookmarks"}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
