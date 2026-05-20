import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { format } from 'date-fns';
import { CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { UserImage } from '@/components/user-image';
import { useInvalidator } from '@/hooks/use-invalidator';
import { userImage } from '@/lib/image';
import { type Outputs, orpc } from '@/lib/orpc';

type Props = {
	invite: Outputs['trips']['listMyInvites']['invites'][number];
};

export function InviteItem({ invite }: Props) {
	const invalidate = useInvalidator();

	const mutation = useMutation(
		orpc.trips.acceptOrDeclineInvite.mutationOptions({
			onSuccess: async ({ accepted }) => {
				toast.success(accepted ? 'Invite accepted' : 'Invite declined');
				await invalidate();
			},
		}),
	);

	return (
		<Item variant="outline" className="hover:bg-muted">
			<ItemMedia>
				<UserImage src={userImage(invite.fromUser.image)} className="size-12" />
			</ItemMedia>

			<ItemContent>
				<ItemTitle>
					<Link
						to="/u/$username"
						params={{
							username: invite.fromUser.username,
						}}
						className="text-primary"
					>
						{invite.fromUser.name}
					</Link>{' '}
					invites you to join {invite.tripTitle}
				</ItemTitle>
				<ItemDescription>
					<div>
						Role: <span className="capitalize">{invite.role}</span>
					</div>
					<div>Expires at: {format(invite.expiresAt, 'PP p')}</div>
				</ItemDescription>
			</ItemContent>

			<ItemActions>
				<Button
					size="sm"
					onClick={() => {
						mutation.mutate({
							accept: true,
							id: invite.tripId,
							inviteId: invite.id,
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
							accept: false,
							id: invite.tripId,
							inviteId: invite.id,
						});
					}}
				>
					<XIcon className="size-4" />
					Decline
				</Button>
			</ItemActions>
		</Item>
	);
}
