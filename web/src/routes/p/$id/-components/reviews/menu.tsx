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
      window.location.reload();
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
          Report
          <DropdownMenuShortcut>
            <FlagIcon className="size-3" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        {isOwner && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                mutation.mutate({
                  params: {
                    path: {
                      id: review.id,
                    },
                  },
                })
              }
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
