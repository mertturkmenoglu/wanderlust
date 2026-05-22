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
import { type Invite, useDeleteInviteMutation } from './-hooks';

type Props = {
	invite: Invite;
};

export function Menu({ invite }: Props) {
	const mutation = useDeleteInviteMutation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings2Icon className="size-4" />
					<span className="sr-only">Edit</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Manage</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={(e) => {
						e.preventDefault();
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
