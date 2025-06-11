import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { AuthContext } from '@/providers/auth-provider';
import { Link } from '@tanstack/react-router';
import { EllipsisVerticalIcon, FlagIcon, TrashIcon } from 'lucide-react';
import { useContext } from 'react';
import { toast } from 'sonner';

type Props = {
  review: components['schemas']['Review'];
};

export function Menu({ review }: Props) {
  const auth = useContext(AuthContext);
  const isOwner = auth.user?.id === review.userId;

  const mutation = api.useMutation('delete', '/api/v2/reviews/{id}', {
    onSuccess: () => {
      toast.success('Review deleted');
      globalThis.window.location.reload();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
      >
        <DropdownMenuItem>
          <Link
            to="/report"
            search={{
              id: review.id,
              type: 'review',
            }}
            className="flex items-center justify-between w-full"
          >
            Report
            <DropdownMenuShortcut>
              <FlagIcon className="size-3" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>

        {isOwner && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                if (confirm('Are you sure you want to delete this review?')) {
                  mutation.mutate({
                    params: {
                      path: {
                        id: review.id,
                      },
                    },
                  });
                }
              }}
            >
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
