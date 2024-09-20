'use client';

import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import { revalidateUserPage } from '../_actions/actions';

type Props = {
  isThisUser: boolean;
  isFollowing: boolean;
  username: string;
};

export default function ActionButtons({
  isThisUser,
  isFollowing,
  username,
}: Props) {
  const mutation = useMutation({
    mutationKey: ['follow', username],
    mutationFn: async () => {
      // TODO: Implement later
    },
    onSettled: async () => {
      return await revalidateUserPage(username);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  async function handleFollowClick() {
    mutation.mutate();
  }

  return (
    <>
      {isThisUser ? (
        <Button
          asChild
          variant="outline"
        >
          <Link href="/settings">Settings</Link>
        </Button>
      ) : (
        <Button
          variant={isFollowing ? 'outline' : 'default'}
          onClick={handleFollowClick}
          disabled={mutation.isPending}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
          {mutation.isPending && (
            <ReloadIcon className="ml-2 size-4 animate-spin" />
          )}
        </Button>
      )}
    </>
  );
}
