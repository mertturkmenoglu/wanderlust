import { getRouteApi } from '@tanstack/react-router';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { AppMessage } from '@/components/app-message';
import {
	useCitiesQuery,
	useDeleteCityRelationMutation,
	useDeletePlaceRelationMutation,
	usePlacesQuery,
} from './-hooks';
import { RelationItem } from './-item';

export function Content() {
	const route = getRouteApi('/_admin/dashboard/collections/relations/');
	const { mode } = route.useSearch();

	if (mode === 'place') {
		return <PlacesContent />;
	}

	return <CitiesContent />;
}

function PlacesContent() {
	const query = usePlacesQuery();
	const mutation = useDeletePlaceRelationMutation();

	if (query.error) {
		return <AppMessage errorMessage="Something went wrong" />;
	}

	if (query.data) {
		if (query.data.relations.length === 0) {
			return <AppMessage emptyMessage="No data" showBackButton={false} />;
		}

		return (
			<div className="mt-4 grid grid-cols-1 gap-2">
				{query.data.relations.map((c) => (
					<RelationItem
						key={cn(c.collectionId, c.placeId)}
						title={`${c.collection.name} - ${c.place.name}`}
						description={
							<div className="flex items-center gap-x-2">
								<a
									href={`/p/${c.placeId}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Go to place
								</a>
								<a
									href={`/c/${c.collectionId}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Go to collection
								</a>
							</div>
						}
						onDelete={async () => {
							mutation.mutate({
								id: c.collectionId,
								placeId: c.placeId,
							});
						}}
					/>
				))}
			</div>
		);
	}

	return <Spinner className="mx-auto my-16" />;
}

function CitiesContent() {
	const query = useCitiesQuery();
	const mutation = useDeleteCityRelationMutation();

	if (query.error) {
		return <AppMessage errorMessage="Something went wrong" />;
	}

	if (query.data) {
		if (query.data.relations.length === 0) {
			return <AppMessage emptyMessage="No data" showBackButton={false} />;
		}

		return (
			<div className="mt-4 grid grid-cols-1 gap-2">
				{query.data.relations.map((c) => (
					<RelationItem
						key={cn(c.collectionId, c.cityId)}
						title={`${c.collection.name} - ${c.city.name}`}
						description={
							<div className="flex items-center gap-x-2">
								<a
									href={`/cities/${c.cityId}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Go to city
								</a>
								<a
									href={`/c/${c.collectionId}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Go to collection
								</a>
							</div>
						}
						onDelete={async () => {
							mutation.mutate({
								id: c.collectionId,
								cityId: c.cityId,
							});
						}}
					/>
				))}
			</div>
		);
	}

	return <Spinner className="mx-auto my-16" />;
}
