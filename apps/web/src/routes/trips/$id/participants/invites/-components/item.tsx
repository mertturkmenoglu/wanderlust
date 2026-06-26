import { Link } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { cn } from '@wanderlust/ui/lib/utils';
import { UserImage } from '@/components/user-image';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import type { Invite } from './hooks';
import { Menu } from './menu';

type Props = {
	invite: Invite;
	className?: string;
};

export function InviteItem({ invite, className }: Props) {
	const isPrivileged = useTripIsPrivileged();

	return (
		<div className={cn('flex flex-row items-center gap-4', className)}>
			<Link
				to="/u/$username"
				params={{
					username: invite.toUser.username,
				}}
				className="flex flex-row items-center gap-4"
			>
				<UserImage src={ipx(userImage(invite.toUser.image), 'w_512')} />

				<div>{invite.toUser.name}</div>
				<div className="text-muted-foreground text-sm">
					@{invite.toUser.username}
				</div>
			</Link>

			<div className="ml-auto flex flex-row items-center gap-2">
				<Badge variant="secondary" className="capitalize">
					{invite.role}
				</Badge>
				{isPrivileged && <Menu invite={invite} />}
			</div>
		</div>
	);
}
