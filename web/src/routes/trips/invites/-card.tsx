import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';
import { CalendarIcon, CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  invite: components['schemas']['TripInvite'];
};

export function InviteCard({ invite }: Props) {
  const invalidator = useInvalidator();
  const [open, setOpen] = useState(false);

  const query = api.useQuery(
    'get',
    '/api/v2/trips/{tripId}/invites/{inviteId}',
    {
      params: {
        path: {
          inviteId: invite.id,
          tripId: invite.tripId,
        },
      },
    },
    {
      enabled: false,
    },
  );

  const mutation = api.useMutation(
    'post',
    '/api/v2/trips/{tripId}/invites/{inviteId}/{action}',
    {
      onSuccess: async ({ accepted }) => {
        toast.success(accepted ? 'Invite accepted' : 'Invite declined');
        setOpen(false);
        await invalidator.invalidate();
      },
    },
  );

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        if (!query.data) {
          query.refetch();
        }
        setOpen(open);
      }}
    >
      <div className="rounded bg-primary/5 p-4">
        <div className="flex items-center gap-4 justify-between">
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
            invited you to a trip.
          </div>

          <PopoverTrigger>
            <Button variant="link" className="px-0">
              {open ? 'Hide' : 'See Details'}
            </Button>
          </PopoverTrigger>
        </div>

        <PopoverContent align="end" className="min-w-md">
          {query.data && (
            <div>
              <div>
                <div className="">
                  You are invited to join{' '}
                  <span className="text-primary">
                    {query.data.inviteDetail.tripTitle}
                  </span>{' '}
                  as a{' '}
                  <span className="text-primary">
                    {query.data.inviteDetail.role}
                  </span>
                  .
                </div>

                <div className="my-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="size-4" />
                    {new Date(
                      query.data.inviteDetail.startAt,
                    ).toLocaleDateString('en-US', {
                      dateStyle: 'full',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="size-4" />
                    {new Date(query.data.inviteDetail.endAt).toLocaleDateString(
                      'en-US',
                      {
                        dateStyle: 'full',
                      },
                    )}
                  </div>
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
          )}
        </PopoverContent>
      </div>
    </Popover>
  );
}
