import { ItemGroup } from '@wanderlust/ui/components/item';
import { useMemo } from 'react';
import { useReviewsQuery } from './-hooks';
import { ReviewItem } from './-item';

export function List() {
	const query = useReviewsQuery();

	const flat = useMemo(() => {
		if (!query.data) {
			return [];
		}

		return query.data.pages.flatMap((p) => p.reviews);
	}, [query.data]);

	return (
		<ItemGroup className="gap-2">
			{flat.map((review) => (
				<ReviewItem key={review.id} review={review} />
			))}
		</ItemGroup>
	);
}
