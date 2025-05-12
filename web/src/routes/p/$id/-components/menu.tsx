import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi, Link } from '@tanstack/react-router';
import { EllipsisVertical, FlagIcon, Plus, Share2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import AddToListButton from './add-to-list-button';

async function handleShareClick() {
  await navigator.clipboard.writeText(window.location.href);
  toast.success('Link copied to clipboard!');
}

export default function Menu() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const auth = useContext(AuthContext);
  const [listId, setListId] = useState<string | null>(null);
  const query = useMyListsInfo(poi.id);

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
              <Link
                to="/report"
                search={{
                  id: poi.id,
                  type: 'poi',
                }}
              >
                <FlagIcon className="mr-2 size-4" />
                Report
              </Link>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a list</DialogTitle>
          <DialogDescription className="w-full">
            {query.data && (
              <Select onValueChange={(v) => setListId(v)}>
                <SelectTrigger className="mt-4 w-full">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-96">
                  {query.data.statuses.map((listStatus) => (
                    <SelectItem
                      value={listStatus.id}
                      key={listStatus.id}
                      disabled={listStatus.includes}
                      className="break-words"
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
          <AddToListButton poiId={poi.id} listId={listId} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useMyListsInfo(poiId: string) {
  const auth = useContext(AuthContext);

  return api.useQuery(
    'get',
    '/api/v2/lists/status/{poiId}',
    {
      params: {
        path: {
          poiId,
        },
      },
    },
    {
      enabled: !!auth.user,
    },
  );
}
