import { UnderlineLink } from '../underline-link';
import { useSearchContext } from './context';

export function EmptyState() {
	const ctx = useSearchContext();

	return (
		<UnderlineLink
			to="/search/$type"
			params={{ type: ctx.searchType }}
			className="ml-4"
		>
			No results found. Try our advanced search.
		</UnderlineLink>
	);
}
