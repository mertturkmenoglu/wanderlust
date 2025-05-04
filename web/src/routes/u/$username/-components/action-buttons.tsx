import Spinner from '@/components/kit/spinner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

type Props = {
  loading: boolean;
  isThisUser: boolean;
  isFollowing: boolean;
  username: string;
};

export default function ActionButtons({
  loading,
  isThisUser,
  isFollowing,
  username,
}: Props) {
  const mutation = api.useMutation('post', '/api/v2/users/follow/{username}', {
    onSettled: () => {
      toast.success(isFollowing ? 'Unfollowed' : 'Followed');
      window.location.reload();
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  async function handleFollowClick() {
    mutation.mutate({
      params: {
        path: {
          username,
        },
      },
    });
  }

  if (loading) {
    return (
      <Button variant="outline">
        <Spinner />
      </Button>
    );
  }

  return (
    <>
      {isThisUser ? (
        <Button asChild variant="outline">
          <Link to="/settings">Settings</Link>
        </Button>
      ) : (
        <Button
          variant={isFollowing ? 'outline' : 'default'}
          onClick={handleFollowClick}
          disabled={mutation.isPending}
        >
          {isFollowing ? 'Following' : 'Follow'}
          {mutation.isPending && (
            <ReloadIcon className="ml-2 size-4 animate-spin" />
          )}
        </Button>
      )}
    </>
  );
}
