import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { Pagination } from '@/components/pagination';
import { PlaceCard } from '@/components/place-card';
import { orpc } from '@/lib/orpc';

export function AccoladePlacesList() {
	const params = useParams({ from: '/accolades/$id/' });
	const search = useSearch({ from: '/accolades/$id/' });

	const query = useSuspenseQuery(
		orpc.accolades.listPlaces.queryOptions({
			input: {
				id: params.id,
				page: search.page ?? 1,
				pageSize: search.pageSize ?? 10,
			},
		}),
	);

	const places = query.data.places;
	const pagination = query.data.pagination;

	return (
		<div className="mt-8">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
				{places.map((p) => (
					<PlaceCard
						key={`accolade-place-list-${p.place.id}`}
						place={p.place}
						meta={p.meta}
						as="link"
					/>
				))}
			</div>

			<Pagination className="mx-auto mt-4" pagination={pagination} />
		</div>
	);
}
