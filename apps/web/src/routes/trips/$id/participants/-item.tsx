import { Link } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { KeySquareIcon, Settings2Icon, UserMinusIcon } from 'lucide-react';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { type TripParticipant, useRemoveParticipantMutation } from './-hooks';

type Props = {
	participant: TripParticipant;
	isPrivileged: boolean;
	className?: string;
};

export function ParticipantItem({
	participant,
	isPrivileged,
	className,
}: Props) {
	const mutation = useRemoveParticipantMutation();

	return (
		<Link
			to="/u/$username"
			params={{
				username: participant.user.username,
			}}
			className={className}
		>
			<Item variant="outline" className="hover:bg-muted">
				<UserImage
					src={ipx(userImage(participant.user.image), 'w_512')}
					className="size-14"
				/>
				<ItemContent>
					<ItemTitle>{participant.user.name}</ItemTitle>
					<ItemDescription>@{participant.user.username}</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Badge variant="secondary" className="capitalize">
						{participant.role}
					</Badge>
					{isPrivileged && participant.role !== 'owner' && (
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
								<DropdownMenuItem variant="default">
									<KeySquareIcon className="size-4" />
									<span>Change Role</span>
								</DropdownMenuItem>

								<DropdownMenuItem
									variant="destructive"
									onClick={(e) => {
										e.preventDefault();
										mutation.mutate({
											id: participant.tripId,
											userId: participant.userId,
										});
									}}
								>
									<UserMinusIcon className="size-4" />
									<span>Remove</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</ItemActions>
			</Item>
		</Link>
	);
}
