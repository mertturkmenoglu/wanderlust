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
import { cn } from '@wanderlust/ui/lib/utils';
import { Settings2Icon, UserMinusIcon } from 'lucide-react';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { useTripParticipantsContext } from './context';
import { useRemoveParticipantMutation } from './hooks';
import type { TripParticipant } from './types';

type Props = {
	participant: TripParticipant;
	className?: string;
};

export function ParticipantItem({ participant, className }: Props) {
	const ctx = useTripParticipantsContext();
	const mutation = useRemoveParticipantMutation();

	return (
		<Link
			to="/u/$username"
			params={{
				username: participant.user.username,
			}}
		>
			<div className={cn('flex items-center gap-4 rounded-lg', className)}>
				<UserImage src={ipx(userImage(participant.user.image), 'w_512')} />

				<div className="font-medium">{participant.user.name}</div>

				<div className="text-muted-foreground text-sm">
					@{participant.user.username}
				</div>

				<Badge variant="secondary" className="ml-auto capitalize">
					{participant.role}
				</Badge>

				{ctx.isPrivileged && participant.role !== 'owner' && (
					<DropdownMenu>
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
			</div>
		</Link>
	);
}
