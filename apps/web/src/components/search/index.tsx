import { useNavigate } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { InstantSearch } from 'react-instantsearch';
import { Autocomplete } from '@/components/autocomplete';
import { useSearchClient } from '@/hooks/use-search-client';

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
				'mx-auto mt-4 flex w-full items-center justify-center space-x-4 md:mt-8',
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
