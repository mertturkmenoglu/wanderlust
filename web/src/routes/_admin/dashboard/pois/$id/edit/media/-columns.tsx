import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getRouteApi } from '@tanstack/react-router';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
  Edit2Icon,
  MoreHorizontalIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export type PoiMedia = {
  url: string;
  alt: string;
};

export const columns: ColumnDef<PoiMedia>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    enableSorting: false,
    cell: ({ row }) => (
      <img
        src={row.original.url}
        alt={row.original.alt}
        className="w-24 object-cover"
      />
    ),
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'alt',
    header: 'Alt',
  },
  {
    id: 'actions',
    cell: (ctx) => <ActionsComponent ctx={ctx} />,
  },
];

export type Props = {
  ctx: CellContext<PoiMedia, unknown>;
};

function ActionsComponent({ ctx: { row, table } }: Props) {
  const route = getRouteApi('/_admin/dashboard/pois/$id/edit');
  const { poi } = route.useLoaderData();

  const media = row.original;
  const lastIndex = table.getRowModel().rows.length - 1;
  const [alt, setAlt] = useState(media.alt);

  return (
    <Drawer direction="right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(media.url);
              toast.success('Image URL copied to clipboard');
            }}
          >
            <ClipboardIcon className="size-4" />
            Copy Image URL
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DrawerTrigger className="flex items-center gap-2">
              <Edit2Icon className="size-4" />
              Edit Image
            </DrawerTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="default"
            disabled={row.index === 0}
            onClick={() => {
              let m = poi.media ? [...poi.media] : [];
              let tmp = m[row.index - 1]!;
              m[row.index - 1] = m[row.index]!;
              m[row.index] = tmp;
            }}
          >
            <ChevronUpIcon className="size-4" />
            Move Up
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="default"
            disabled={row.index === lastIndex}
            onClick={() => {
              let m = poi.media ? [...poi.media] : [];
              let tmp = m[row.index + 1]!;
              m[row.index + 1] = m[row.index]!;
              m[row.index] = tmp;
            }}
          >
            <ChevronDownIcon className="size-4" />
            Move Down
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {}}
          >
            <Trash2Icon className="size-4" />
            Delete Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Image</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <img
            src={media.url}
            alt={media.alt}
            className=""
          />

          <div className="flex gap-4 items-center mt-4">
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                type="text"
                id="alt"
                placeholder="Describe the image for accessibility tools (Optional)"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={async () => {}}>Update</Button>
          <DrawerClose className="w-full">
            <Button
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
