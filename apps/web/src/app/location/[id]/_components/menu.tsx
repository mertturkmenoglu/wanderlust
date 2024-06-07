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
import { api, rpc } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { EllipsisVertical, FlagIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import AddToListButton from './add-to-list-button';

type Props = {
  locationId: string;
};

export default function Menu({ locationId }: Props) {
  const { isSignedIn } = useAuth();
  const [listId, setListId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['my-lists'],
    queryFn: async () => {
      const res = await rpc(() => api.lists.my.$get());
      return res.data;
    },
  });

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
            <EllipsisVertical className="size-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className=" w-32 space-y-2 p-2"
          align="end"
        >
          <DropdownMenuItem className="cursor-pointer p-0">
            <Button
              className="flex w-full justify-start hover:no-underline"
              variant="link"
              size="sm"
            >
              <FlagIcon className="mr-2 size-4" />
              Report
            </Button>
          </DropdownMenuItem>

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
