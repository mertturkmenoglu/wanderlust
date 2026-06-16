import { UnderlineLink } from '../underline-link';

export function AdvancedSearchLink() {
	return (
		<div className="text-sm leading-none tracking-tight">
			Need more power? Try our{' '}
			<UnderlineLink to="/search">Advanced Search</UnderlineLink>
		</div>
	);
}
