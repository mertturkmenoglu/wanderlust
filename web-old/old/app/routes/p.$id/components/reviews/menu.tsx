import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVerticalIcon, FlagIcon, TrashIcon } from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { deleteReview } from "~/lib/api-requests";
import { GetReviewByIdResponseDto } from "~/lib/dto";
import { AuthContext } from "~/providers/auth-provider";

type Props = {
  review: GetReviewByIdResponseDto;
};

export function Menu({ review }: Props) {
  const auth = useContext(AuthContext);
  const isOwner = auth.user?.data.id === review.userId;
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-review", review.id],
    mutationFn: async () => deleteReview(review.id),
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({
        queryKey: ["reviews", review.poiId],
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem>
          Report
          <DropdownMenuShortcut>
            <FlagIcon className="size-3" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        {isOwner && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => mutation.mutate()}>
              Delete
              <DropdownMenuShortcut>
                <TrashIcon className="size-3" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
