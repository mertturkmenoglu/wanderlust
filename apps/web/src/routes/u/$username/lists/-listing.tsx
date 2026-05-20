import { ItemGroup } from '@wanderlust/ui/components/item';
import { useFlattenedQuery } from '@/hooks/use-flattened-query';
import { usePublicListsQuery } from './-hooks';
import { ListingItem } from './-item';

export function Listing() {
	const query = usePublicListsQuery();
	const flat = useFlattenedQuery(query.data, (page) => page.lists);

	return (
		<ItemGroup className="gap-2">
			{flat.map((list) => (
				<ListingItem key={list.id} list={list} />
			))}
		</ItemGroup>
	);
}
