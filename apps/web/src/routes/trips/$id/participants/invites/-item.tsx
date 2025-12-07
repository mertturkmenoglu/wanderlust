import { useMutation } from '@tanstack/react-query';
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
import { toast } from 'sonner';
import { UserImage } from '@/components/user-image';
import { useInvalidator } from '@/hooks/use-invalidator';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';

type Props = {
	image: string;
	name: string;
	username: string;
	role: string;
	isPrivileged: boolean;
	className?: string;
	id: string;
	tripId: string;
};

export function Item({
	image,
	name,
	username,
	role,
	isPrivileged,
	className,
	id,
	tripId,
}: Props) {
	const invalidate = useInvalidator();
	const removeInviteMutation = useMutation(
		orpc.trips.deleteInvite.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Invite removed');
			},
		}),
	);

	return (
		<Link
			to="/u/$username"
			params={{
				username,
			}}
			className={cn('flex items-center gap-4', className)}
		>
			<UserImage
				src={ipx(userImage(image), 'w_512')}
				imgClassName="size-16"
				fallbackClassName="size-16 rounded-md"
				className="size-16 rounded-md"
			/>

			<div>
				<div className="font-bold text-xl">{name}</div>
				<div className="text-primary text-xs">@{username}</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<Badge variant="secondary" className="capitalize">
					{role}
				</Badge>
				{isPrivileged && (
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
									removeInviteMutation.mutate({
										id: tripId,
										inviteId: id,
									});
								}}
							>
								<UserMinusIcon className="size-4" />
								<span>Remove Invite</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</Link>
	);
}
