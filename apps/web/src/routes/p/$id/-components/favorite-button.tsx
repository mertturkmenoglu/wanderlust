// oxlint-disable func-style

import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { HeartIcon } from 'lucide-react';
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
					<Button variant="ghost" onClick={onClick}>
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
