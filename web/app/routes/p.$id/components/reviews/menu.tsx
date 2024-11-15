import { EllipsisVerticalIcon, FlagIcon, TrashIcon } from "lucide-react";
import { useContext } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { GetReviewByIdResponseDto } from "~/lib/dto";
import { AuthContext } from "~/providers/auth-provider";

type Props = {
  review: GetReviewByIdResponseDto;
};

export function Menu({ review }: Props) {
  const auth = useContext(AuthContext);
  const isOwner = auth.user?.data.id === review.userId;

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

            <DropdownMenuItem>
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
