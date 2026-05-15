import { getRouteApi } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { useEffect } from 'react';
import { TopPlacesContextProvider, useTopPlacesContext } from './context';
import { Grid } from './grid';
import { useTopPlacesQuery } from './hooks';
import { UpdateDialog } from './update-dialog';

type Props = {
	className?: string;
};

export function TopPlaces({ className }: Props) {
	return (
		<TopPlacesContextProvider>
			<Container className={className} />
		</TopPlacesContextProvider>
	);
}

function Container({ className }: Props) {
	const rootRoute = getRouteApi('/u/$username');
	const data = rootRoute.useLoaderData();
	const query = useTopPlacesQuery(data.profile.username);
	const isThisUser = data.meta.isSelf;
	const ctx = useTopPlacesContext();

	useEffect(() => {
		if (query.data?.places) {
			ctx.setItems(query.data.places);
		}
	}, [query.data.places, ctx.setItems]);

	return (
		<div className={cn(className)}>
			<div className="font-medium text-2xl">
				<span>Favorite Places</span>
				{isThisUser && <UpdateDialog />}
			</div>

			<Grid className="mt-4" />
		</div>
	);
}
