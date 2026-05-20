import { ItemGroup } from '@wanderlust/ui/components/item';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { useReviewsQuery } from './-hooks';
import { ReviewItem } from './-item';

export function List() {
	const query = useReviewsQuery();
	const flat = useFlattenedQuery(query.data, (p) => p.reviews);

	return (
		<ItemGroup className="gap-2">
			{flat.map((review) => (
				<ReviewItem key={review.id} review={review} />
			))}
		</ItemGroup>
	);
}
