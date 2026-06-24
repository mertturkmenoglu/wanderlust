import { cn } from '@wanderlust/ui/lib/utils';
import { UnderlineLink } from '../underline-link';
import { useSearchContext } from './context';

type Props = {
	className?: string;
};

export function AdvancedSearchLink({ className }: Props) {
	const ctx = useSearchContext();

	if (ctx.variant === 'local') {
		return null;
	}

	return (
		<div className={cn('text-sm leading-none tracking-tight', className)}>
			Exploring something specific? Dig deeper with{' '}
			<UnderlineLink
				to="/search/$type"
				params={{
					type: ctx.searchType,
				}}
			>
				advanced search
			</UnderlineLink>
		</div>
	);
}
