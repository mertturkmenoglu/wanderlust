import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getRouteApi, Link } from '@tanstack/react-router';
import { EllipsisVerticalIcon, FlagIcon, Share2Icon } from 'lucide-react';
import { toast } from 'sonner';

async function handleShareClick() {
  await navigator.clipboard.writeText(globalThis.window.location.href);
  toast.success('Link copied to clipboard!');
}

export function Menu() {
  const route = getRouteApi('/p/$id/');
  const { place } = route.useLoaderData();

  return (
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
          <EllipsisVerticalIcon className="size-6 text-primary" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-48 space-y-2 p-2"
        align="end"
      >
        <DropdownMenuItem className="cursor-pointer p-0">
          <Button
            className="flex w-full justify-start hover:no-underline"
            variant="link"
            size="sm"
            onClick={handleShareClick}
          >
            <Share2Icon className="mr-2 size-4" />
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
                id: place.id,
                type: 'place',
              }}
            >
              <FlagIcon className="mr-2 size-4" />
              Report
            </Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
