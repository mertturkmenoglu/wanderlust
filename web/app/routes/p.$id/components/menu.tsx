import { Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical, FlagIcon, Plus, Share2 } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getListStatus } from "~/lib/api-requests";
import { AuthContext } from "~/providers/auth-provider";
import AddToListButton from "./add-to-list-button";

type Props = {
  poiId: string;
};

async function handleShareClick() {
  await navigator.clipboard.writeText(window.location.href);
  toast.success("Link copied to clipboard!");
}

export default function Menu({ poiId }: Props) {
  const auth = useContext(AuthContext);
  const [listId, setListId] = useState<string | null>(null);
  const query = useMyListsInfo(poiId);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="block">
          <Button
            className="flex items-center justify-center rounded-full"
            variant="ghost"
            size="icon"
          >
            <EllipsisVertical className="size-6 text-primary" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48 space-y-2 p-2" align="end">
          {!!auth.user && (
            <DialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer p-0">
                <Button
                  className="flex w-full justify-start hover:no-underline"
                  variant="link"
                  size="sm"
                  type="button"
                >
                  <Plus className="mr-2 size-4" />
                  Add to list
                </Button>
              </DropdownMenuItem>
            </DialogTrigger>
          )}

          <DropdownMenuItem className="cursor-pointer p-0">
            <Button
              className="flex w-full justify-start hover:no-underline"
              variant="link"
              size="sm"
              onClick={handleShareClick}
            >
              <Share2 className="mr-2 size-4" />
              Share
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer p-0">
            <Button
              className="flex w-full justify-start hover:no-underline"
              variant="link"
              size="sm"
              asChild
            >
              <Link to={`/report?id=${poiId}&type=poi`}>
                <FlagIcon className="mr-2 size-4" />
                Report
              </Link>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a list</DialogTitle>
          <DialogDescription>
            {query.data && (
              <Select onValueChange={(v) => setListId(v)}>
                <SelectTrigger className="mt-4">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  {query.data.data.statuses.map((listStatus) => (
                    <SelectItem
                      value={listStatus.id}
                      key={listStatus.id}
                      disabled={listStatus.includes}
                    >
                      {listStatus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <AddToListButton poiId={poiId} listId={listId} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useMyListsInfo(poiId: string) {
  const auth = useContext(AuthContext);
  const isSignedIn = !!auth.user;

  const query = useQuery({
    queryKey: ["my-lists-info", poiId],
    queryFn: async () => getListStatus(poiId),
    enabled: isSignedIn,
  });

  return query;
}
