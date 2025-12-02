import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';
import { useInvalidator } from '@/hooks/use-invalidator';
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
				<Avatar className="size-12">
					<AvatarImage
						src={invite.fromUser.image ?? ''}
						className="object-cover"
					/>
					<AvatarFallback>{invite.fromUser.name[0] ?? ''}</AvatarFallback>
				</Avatar>
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
					<div>Role: {invite.role}</div>
					<div>Expires at: {invite.expiresAt.toLocaleDateString()}</div>
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
