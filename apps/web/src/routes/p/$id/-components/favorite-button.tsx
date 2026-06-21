import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import { cn } from '@wanderlust/ui/lib/utils';
import { HeartIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

export function FavoriteButton() {
	const route = getRouteApi('/p/$id/');
	const { place, meta } = route.useLoaderData();
	const [fav, setFav] = useState(meta.isFavorite);
	const invalidate = useInvalidator();
	const session = authClient.useSession();

	const createMutation = useMutation(
		orpc.favorites.create.mutationOptions({
			onSuccess: async () => {
				setFav((prev) => !prev);
				await invalidate();
				toast.success('Added to favorites');
			},
		}),
	);

	const deleteMutation = useMutation(
		orpc.favorites.delete.mutationOptions({
			onSuccess: async () => {
				setFav((prev) => !prev);
				await invalidate();
				toast.success('Removed from favorites');
			},
		}),
	);

	const onClick = () => {
		if (!session.data?.user) {
			toast.warning('You need to be signed in.');
			return;
		}

		if (fav) {
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
					<Button variant="ghost" onClick={onClick} size="icon">
						<HeartIcon
							className={cn('size-6 text-primary', {
								'fill-primary': fav,
							})}
						/>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>{fav ? 'Remove favorite' : 'Add to favorites'}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
