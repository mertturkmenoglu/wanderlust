import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { XIcon } from 'lucide-react';
import { useRecentSearches } from './hooks';

export function RecentSearchesView() {
	const { values, clearValues } = useRecentSearches();

	if (values.length === 0) {
		return (
			<div className="text-muted-foreground text-sm">
				Type to see results...
			</div>
		);
	}

	return (
		<div className="">
			<div className="flex items-center justify-between">
				<span className="text-sm tracking-tighter">Recent searches:</span>
				<Button variant="link" onClick={clearValues}>
					<XIcon />
					<span>Clear</span>
				</Button>
			</div>
			<div className="flex flex-col items-start gap-2">
				{values.map((s) => (
					<Link
						key={`recent-search-${s}`}
						to="/search"
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
