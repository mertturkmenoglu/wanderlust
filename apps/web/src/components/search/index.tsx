import { cn } from '@wanderlust/ui/lib/utils';
import { AdvancedSearchLink } from './advanced-search-link';
import { Content } from './content';
import { SearchContextProvider } from './context';
import { InstantSearchProvider } from './instant-search-provider';
import { TypeSelector } from './type-selector';

type Props = {
	className?: string;
};

export function Search({ className }: Props) {
	return (
		<InstantSearchProvider>
			<SearchContextProvider>
				<nav className={cn('flex w-full flex-col gap-4', className)}>
					<TypeSelector className="mx-auto" />

					<Content />

					<AdvancedSearchLink className="text-center" />
				</nav>
			</SearchContextProvider>
		</InstantSearchProvider>
	);
}
