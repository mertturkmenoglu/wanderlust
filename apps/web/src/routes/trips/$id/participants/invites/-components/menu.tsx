import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import { Settings2Icon, UserMinusIcon } from 'lucide-react';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { type Invite, useDeleteInviteMutation } from './hooks';

type Props = {
	invite: Invite;
};

export function Menu({ invite }: Props) {
	const mutation = useDeleteInviteMutation();
	const confirm = useConfirmDialog();

	return (
		<DropdownMenu>
			{confirm.Dialog}

			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings2Icon className="size-4" />
					<span className="sr-only">Edit</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuLabel>Manage</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={async (e) => {
						e.stopPropagation();
						e.preventDefault();

						const ok = await confirm.confirm({
							variant: 'destructive',
							title: 'Remove Invite',
							description:
								'Are you sure you want to remove this invite? If you want to invite this user again, you will have to send a new invite.',
							confirmText: 'Remove Invite',
						});

						if (!ok) {
							return;
						}

						mutation.mutate({
							id: invite.tripId,
							inviteId: invite.id,
						});
					}}
				>
					<UserMinusIcon className="size-4" />
					<span>Remove Invite</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
