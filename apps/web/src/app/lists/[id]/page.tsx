import EmptyContent from '@/components/blocks/EmptyContent';
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
import { api, rpc } from '@/lib/api';
import { currentUser } from '@clerk/nextjs/server';
import {
  ChevronLeft,
  EllipsisVertical,
  FlagIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import DeleteButton from './_components/delete-button';
import Items from './_components/items';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};

async function getList(id: string) {
  return rpc(() =>
    api.lists[':id'].$get({
      param: {
        id,
      },
    })
  );
}

export default async function Page({ params: { id } }: Props) {
  const list = await getList(id);
  const user = await currentUser();
  const belongsToCurrentUser = list.data.user.username === user?.username;

  return (
    <div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col justify-start">
          <Button
            asChild
            variant="link"
            className="w-min px-0"
          >
            <Link href="/lists">
              <ChevronLeft className="mr-2 size-4" />
              <span>Lists</span>
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">
            {list.data.name}
          </h2>
        </div>

        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="block"
            >
              <Button
                className="block"
                variant="ghost"
              >
                <EllipsisVertical className="size-6" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="mr-4 w-32 space-y-2 p-2"
              align="end"
            >
              <DropdownMenuItem className="cursor-pointer p-0">
                <Button
                  className="flex w-full justify-start hover:no-underline"
                  variant="link"
                  size="sm"
                  asChild
                >
                  <Link href={`/report?id=${id}&type=list`}>
                    <FlagIcon className="mr-2 size-4" />
                    Report
                  </Link>
                </Button>
              </DropdownMenuItem>
              {belongsToCurrentUser && (
                <DialogTrigger asChild>
                  <DropdownMenuItem className="cursor-pointer p-0">
                    <Button
                      className="flex w-full justify-start text-destructive hover:no-underline"
                      variant="link"
                      size="sm"
                      type="button"
                    >
                      <TrashIcon className="mr-2 size-4" />
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this list?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DeleteButton listId={id} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <hr className="my-2" />
      <div className="my-16">
        {(list.data.isPublic || belongsToCurrentUser) && (
          <Items items={list.data.items} />
        )}
        {!list.data.isPublic && !belongsToCurrentUser && (
          <EmptyContent errorMessage="You do not have the permissions to view this list" />
        )}
      </div>
    </div>
  );
}
