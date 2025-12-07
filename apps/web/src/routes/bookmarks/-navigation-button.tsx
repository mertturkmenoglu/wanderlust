import { Link, useSearch } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { PaginationItem } from '@wanderlust/ui/components/pagination';
import { cn } from '@wanderlust/ui/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type Props = {
	type: 'previous' | 'next';
	hasPrevious?: boolean;
	hasNext?: boolean;
};

export function NavigationButton({ type, hasPrevious, hasNext }: Props) {
	const { page, pageSize } = useSearch({
		from: '/bookmarks/',
	});

	const ariaLabel =
		type === 'previous' ? 'Go to previous page' : 'Go to next page';

	const btnText = type === 'previous' ? 'Previous' : 'Next';

	const nextPage = hasNext ? page + 1 : page;
	const prevPage = hasPrevious ? page - 1 : 1;
	const succeeding = type === 'next' ? nextPage : prevPage;

	return (
		<PaginationItem>
			<Link
				data-slot="pagination-link"
				className={cn(
					buttonVariants({
						variant: 'ghost',
					}),
					'gap-1 px-2.5 sm:pl-2.5',
				)}
				aria-label={ariaLabel}
				to="/bookmarks"
				search={{
					page: succeeding,
					pageSize,
				}}
			>
				{type === 'next' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
				<span className="hidden sm:block">{btnText}</span>
			</Link>
		</PaginationItem>
	);
}
