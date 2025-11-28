import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';
import { CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  invite: components['schemas']['TripInvite'];
};

export function InviteCard({ invite }: Props) {
  const invalidator = useInvalidator();

  const mutation = api.useMutation(
    'post',
    '/api/v2/trips/{tripId}/invites/{inviteId}/{action}',
    {
      onSuccess: async ({ accepted }) => {
        toast.success(accepted ? 'Invite accepted' : 'Invite declined');
        await invalidator.invalidate();
      },
    },
  );

  return (
    <div className="rounded bg-primary/5 p-4">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/u/$username"
            params={{
              username: invite.from.username,
            }}
            className="text-primary"
          >
            {invite.from.fullName}
          </Link>{' '}
          invited you to join{' '}
          <span className="text-primary">{invite.tripTitle}</span> as a{' '}
          <span className="text-primary">{invite.role}</span>.
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            size="sm"
            onClick={() => {
              mutation.mutate({
                params: {
                  path: {
                    action: 'accept',
                    inviteId: invite.id,
                    tripId: invite.tripId,
                  },
                },
              });
            }}
          >
            <CheckIcon className="size-4" />
            Accept
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              mutation.mutate({
                params: {
                  path: {
                    action: 'decline',
                    inviteId: invite.id,
                    tripId: invite.tripId,
                  },
                },
              });
            }}
          >
            <XIcon className="size-4" />
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
