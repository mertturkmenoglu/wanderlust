import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { getRouteApi } from '@tanstack/react-router';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardIcon,
  Edit2Icon,
  MoreHorizontal,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export type PoiMedia = {
  url: string;
  alt: string;
  caption: string;
  extension: string;
  fileName: string;
};

export const columns: ColumnDef<PoiMedia>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'image',
    header: 'Image',
    enableSorting: false,
    cell: ({ row }) => (
      <img
        src={row.original.url}
        alt={row.original.alt}
        className="w-16"
      />
    ),
  },
  {
    accessorKey: 'fileName',
    header: 'File Name',
  },

  {
    accessorKey: 'alt',
    header: 'Alt',
  },
  {
    accessorKey: 'caption',
    header: 'Caption',
  },
  {
    accessorKey: 'extension',
    header: 'Extension',
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
  const route = getRouteApi('/_admin/dashboard/pois/drafts/$id/');
  const qc = route.useRouteContext().queryClient;
  const invalidator = useInvalidator();
  const { draft: d } = route.useLoaderData();
  let draft = d as any;

  const media = row.original;
  const lastIndex = table.getRowModel().rows.length - 1;
  const [alt, setAlt] = useState(media.alt);
  const [caption, setCaption] = useState(media.caption);

  const updateMutation = api.useMutation(
    'patch',
    '/api/v2/pois/drafts/{id}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Image updated');
      },
    },
    qc,
  );

  const deleteMutation = api.useMutation(
    'delete',
    '/api/v2/pois/drafts/{id}/media/{index}',
    {
      onSuccess: async () => {
        toast.success('Image deleted');
        window.location.reload();
      },
    },
    qc,
  );

  return (
    <Drawer direction="right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
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
              let m = draft.media ? [...draft.media] : [];
              let tmp = m[row.index - 1];
              m[row.index - 1] = m[row.index];
              m[row.index] = tmp;

              updateMutation.mutate({
                params: {
                  path: {
                    id: draft.id,
                  },
                },
                body: {
                  values: {
                    ...draft,
                    media: m,
                  },
                },
              });
            }}
          >
            <ChevronUpIcon className="size-4" />
            Move Up
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="default"
            disabled={row.index === lastIndex}
            onClick={() => {
              let m = draft.media ? [...draft.media] : [];
              let tmp = m[row.index + 1];
              m[row.index + 1] = m[row.index];
              m[row.index] = tmp;

              updateMutation.mutate({
                params: {
                  path: {
                    id: draft.id,
                  },
                },
                body: {
                  values: {
                    ...draft,
                    media: m,
                  },
                },
              });
            }}
          >
            <ChevronDownIcon className="size-4" />
            Move Down
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              deleteMutation.mutate({
                params: {
                  path: {
                    id: draft.id,
                    index: row.index,
                  },
                },
              });
            }}
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

          <div className="flex gap-4 items-center mt-4">
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="caption">Caption</Label>
              <Input
                type="text"
                id="caption"
                placeholder="Caption for the image (Optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button
            onClick={async () => {
              let oldMedia = draft.media ? [...draft.media] : [];

              oldMedia.splice(row.index, 1, {
                url: media.url,
                alt: alt,
                caption: caption,
                extension: media.extension,
                fileName: media.fileName,
              });

              updateMutation.mutate({
                params: {
                  path: {
                    id: draft.id,
                  },
                },
                body: {
                  values: {
                    ...draft,
                    media: oldMedia,
                  },
                },
              });
            }}
          >
            Update
          </Button>
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
