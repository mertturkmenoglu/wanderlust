import { useNavigate } from '@tanstack/react-router';
import { InstantSearch } from 'react-instantsearch';
import { Autocomplete } from '@/components/blocks/autocomplete';
import { useSearchClient } from '@/hooks/use-search-client';
import { cn } from '@/lib/utils';

type Props = {
	className?: string;
	onItemClicked?: () => void;
	showAdvancedSearch?: boolean;
};

export function Search({
	className,
	onItemClicked,
	showAdvancedSearch = true,
}: Props) {
	const searchClient = useSearchClient();
	const navigate = useNavigate();

	return (
		<nav
			className={cn(
				'mx-auto my-12 flex w-full items-center justify-center space-x-4',
				className,
			)}
		>
			<InstantSearch
				indexName="places"
				searchClient={searchClient}
				routing={false}
				future={{
					preserveSharedStateOnUnmount: true,
				}}
			>
				<Autocomplete
					showAdvancedSearch={showAdvancedSearch}
					isCardClickable
					onCardClick={(v) => {
						navigate({
							to: '/p/$id',
							params: {
								id: v.id,
							},
						});
						if (onItemClicked !== undefined) {
							onItemClicked();
						}
					}}
				/>
			</InstantSearch>
		</nav>
	);
}
