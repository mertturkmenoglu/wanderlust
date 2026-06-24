import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { XIcon } from 'lucide-react';
import { useRecentSearches } from '@/hooks/use-recent-searches';
import { useSearchContext } from './context';

export function RecentSearchesView() {
	const ctx = useSearchContext();
	const [searches, , clearSearches] = useRecentSearches();
	const searchItems = searches[ctx.searchType];

	if (searchItems.length === 0) {
		return (
			<div className="text-muted-foreground text-sm">
				Type to see results...
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between">
				<span className="text-sm tracking-tighter">Recent searches:</span>
				<Button variant="link" onClick={clearSearches}>
					<XIcon />
					<span>Clear</span>
				</Button>
			</div>
			<div className="flex flex-col items-start gap-2">
				{searchItems.map((s) => (
					<Link
						key={`recent-search=${ctx.searchType}-${s}`}
						to="/search/$type"
						params={{ type: ctx.searchType }}
						search={{ q: s }}
						className="w-full hover:-mx-2 hover:bg-primary/10 hover:px-2 hover:text-primary"
					>
						{s}
					</Link>
				))}
			</div>
		</div>
	);
}
