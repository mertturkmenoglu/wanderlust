import { useNavigate } from '@tanstack/react-router';
import { Search } from '@/components/search';
import type { TPlaceHit } from '@/lib/search';

export function SearchView() {
	const navigate = useNavigate({ from: '/trips/$id/details/' });

	return (
		<Search
			variant="local"
			onItemClick={(v) => {
				const hit = v as TPlaceHit;

				navigate({
					to: '.',
					search: (prev) => ({ ...prev, placeId: hit.place.id }),
				});
			}}
		/>
	);
}
