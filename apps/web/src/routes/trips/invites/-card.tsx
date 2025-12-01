import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { type Outputs, orpc } from '@/lib/orpc';

type Props = {
	invite: Outputs['trips']['listMyInvites']['invites'][number];
};

export function InviteCard({ invite }: Props) {
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
		<div className="rounded bg-primary/5 p-4">
			<div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<Link
						to="/u/$username"
						params={{
							username: invite.fromUser.username,
						}}
						className="text-primary"
					>
						{invite.fromUser.name}
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
				</div>
			</div>
		</div>
	);
}
