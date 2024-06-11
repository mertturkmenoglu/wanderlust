'use client';

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
import { useAuth } from '@clerk/nextjs';
import { EllipsisVertical, FlagIcon, Plus, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import AddToListButton from './add-to-list-button';
import { useMyListsInfo } from './hooks/use-my-lists-info';

type Props = {
  locationId: string;
};

async function handleShareClick() {
  await navigator.clipboard.writeText(window.location.href);
  toast.success('Link copied to clipboard!');
}

export default function Menu({ locationId }: Props) {
  const { isSignedIn } = useAuth();
  const [listId, setListId] = useState<string | null>(null);
  const query = useMyListsInfo(locationId);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="block"
        >
          <Button
            className="flex items-center justify-center rounded-full"
            variant="ghost"
            size="icon"
          >
            <EllipsisVertical className="size-6 text-primary" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-48 space-y-2 p-2"
          align="end"
        >
          {isSignedIn && (
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
              <Link href={`/report?id=${locationId}&type=location`}>
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
                  {query.data.map((list) => (
                    <SelectItem
                      value={list.id}
                      key={list.id}
                      disabled={list.includes}
                    >
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <AddToListButton
            locationId={locationId}
            listId={listId}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
