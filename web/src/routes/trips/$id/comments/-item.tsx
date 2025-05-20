import UserImage from '@/components/blocks/user-image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { AuthContext } from '@/providers/auth-provider';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  comment: components['schemas']['TripComment'];
  isPrivileged: boolean;
};

export function Item({ comment, isPrivileged }: Props) {
  const auth = useContext(AuthContext);
  const isOwner = comment.from.id === auth.user?.id;
  const invalidator = useInvalidator();
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState(comment.content);

  const deleteCommentMutation = api.useMutation(
    'delete',
    '/api/v2/trips/{tripId}/comments/{commentId}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Comment removed');
      },
    },
  );

  const updateCommentMutation = api.useMutation(
    'patch',
    '/api/v2/trips/{tripId}/comments/{commentId}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Comment updated');
      },
    },
  );

  return (
    <div className="not-first:border-t border-border py-4">
      <div className="flex items-start gap-4">
        <UserImage
          src={ipx(userImage(comment.from.profileImage), 'w_512')}
          imgClassName="size-16"
          fallbackClassName="size-16 rounded-md"
          className="size-16 rounded-md"
        />
        <div className="w-full">
          <div className="font-bold">{comment.from.fullName}</div>
          <div
            className="text-xs text-muted-foreground"
            title={comment.createdAt}
          >
            {formatDistanceToNow(comment.createdAt)} ago
          </div>

          {isEditMode ? (
            <div className="mt-2 flex gap-2 items-center w-full">
              <Input
                type="text"
                autoComplete="off"
                value={content}
                minLength={1}
                maxLength={255}
                onChange={(e) => setContent(e.target.value)}
                className="w-full"
              />
              <Button
                variant="default"
                size="icon"
                className=""
                onClick={() => {
                  updateCommentMutation.mutate({
                    params: {
                      path: {
                        commentId: comment.id,
                        tripId: comment.tripId,
                      },
                    },
                    body: {
                      content,
                    },
                  });
                  setIsEditMode(false);
                }}
              >
                <CheckIcon className="size-4" />
                <span className="sr-only">Save</span>
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className=""
                onClick={() => {
                  setContent(comment.content);
                  setIsEditMode(false);
                }}
              >
                <XIcon className="size-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </div>
          ) : (
            <div className="mt-1">{comment.content}</div>
          )}
        </div>
        <div className="ml-auto">
          {(isOwner || isPrivileged) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="size-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner && (
                  <DropdownMenuItem
                    variant="default"
                    onClick={() => {
                      setIsEditMode(true);
                    }}
                  >
                    <PencilIcon className="size-4" />
                    <span>Edit Comment</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      confirm('Are you sure you want to delete this comment?')
                    ) {
                      deleteCommentMutation.mutate({
                        params: {
                          path: {
                            commentId: comment.id,
                            tripId: comment.tripId,
                          },
                        },
                      });
                    }
                  }}
                >
                  <Trash2Icon className="size-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
