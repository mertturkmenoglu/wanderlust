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
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { type TTripInvite, useAcceptOrDeclineInviteMutation } from './-hooks';

type Props = {
	invite: TTripInvite;
};

export function InviteItem({ invite }: Props) {
	const mutation = useAcceptOrDeclineInviteMutation();

	const acceptInvite = () => {
		mutation.mutate({
			accept: true,
			id: invite.tripId,
			inviteId: invite.id,
		});
	};

	const declineInvite = () => {
		mutation.mutate({
			accept: false,
			id: invite.tripId,
			inviteId: invite.id,
		});
	};

	return (
		<Item variant="outline" className="hover:bg-muted">
			<ItemMedia>
				<UserImage src={userImage(invite.from.image)} className="size-12" />
			</ItemMedia>

			<ItemContent>
				<ItemTitle>
					<Link
						to="/u/$username"
						params={{
							username: invite.from.username,
						}}
						className="text-primary"
					>
						{invite.from.name}
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
				<Button size="sm" onClick={acceptInvite}>
					<CheckIcon />
					Accept
				</Button>

				<Button size="sm" variant="destructive" onClick={declineInvite}>
					<XIcon />
					Decline
				</Button>
			</ItemActions>
		</Item>
	);
}
