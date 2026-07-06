import { cn } from '@wanderlust/ui/lib/utils';
import { AdvancedSearchLink } from './advanced-search-link';
import { Content } from './content';
import { SearchContextProvider, type TSearchResultType } from './context';
import { InstantSearchProvider } from './instant-search-provider';
import { TypeSelector } from './type-selector';

type Props = {
	variant: 'global' | 'local';
	className?: string;
	onItemClick?: (v: TSearchResultType) => void;
};

export function Search({ variant, className, onItemClick }: Props) {
	return (
		<InstantSearchProvider variant={variant}>
			<SearchContextProvider variant={variant} onItemClick={onItemClick}>
				<nav className={cn('flex w-full flex-col gap-4', className)}>
					{variant === 'global' && <TypeSelector className="mx-auto" />}

					<Content />

					{variant === 'global' && (
						<AdvancedSearchLink className="text-center" />
					)}
				</nav>
			</SearchContextProvider>
		</InstantSearchProvider>
	);
}
