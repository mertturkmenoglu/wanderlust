import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { BookmarkIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';

export function BookmarkButton() {
	const route = getRouteApi('/p/$id/');
	const { place, meta } = route.useLoaderData();
	const [booked, setBooked] = useState(meta.isBookmarked);
	const invalidate = useInvalidator();
	const session = authClient.useSession();

	const createMutation = useMutation(
		orpc.bookmarks.create.mutationOptions({
			onSuccess: async () => {
				setBooked((prev) => !prev);
				await invalidate();
				toast.success('Bookmark added');
			},
		}),
	);

	const deleteMutation = useMutation(
		orpc.bookmarks.delete.mutationOptions({
			onSuccess: async () => {
				setBooked((prev) => !prev);
				await invalidate();
				toast.success('Bookmark removed');
			},
		}),
	);

	const onClick = () => {
		if (!session.data?.user) {
			toast.warning('You need to be signed in.');
			return;
		}

		if (booked) {
			deleteMutation.mutate({
				placeId: place.id,
			});

			return;
		}

		createMutation.mutate({
			placeId: place.id,
		});
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="ghost" onClick={onClick}>
						<BookmarkIcon
							className={cn('size-6 text-primary', {
								'fill-primary': booked,
							})}
						/>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<div>{booked ? 'Remove bookmark' : 'Add to bookmarks'}</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
