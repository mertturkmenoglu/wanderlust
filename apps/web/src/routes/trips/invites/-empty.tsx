import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';

export function EmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<img
						src="/logo.png"
						alt=""
						className="size-24 min-h-24 min-w-24 grayscale"
					/>
				</EmptyMedia>
				<EmptyTitle>No invites found</EmptyTitle>
				<EmptyDescription>
					You don't have any invites. You can create your own trip and invite
					your friends.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link
					to="/trips"
					search={{
						showNewDialog: true,
					}}
					className={buttonVariants({})}
				>
					<PlusIcon />
					<span>New Trip</span>
				</Link>
			</EmptyContent>
		</Empty>
	);
}
