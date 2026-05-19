import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useReviewsQuery } from './hooks';

export function Pagination() {
	const query = useReviewsQuery();
	const navigate = useNavigate({ from: '/p/$id/' });
	const search = useSearch({ from: '/p/$id/' });

	if (!query.data) {
		return null;
	}

	const { pagination } = query.data;

	return (
		<ButtonGroup>
			<Button
				className="w-32"
				disabled={!pagination.hasPrevious}
				variant="outline"
				onClick={() => {
					navigate({
						to: '.',
						hash: 'reviews',
						search: (prev) => ({
							...prev,
							page: pagination.page - 1,
						}),
					});
				}}
			>
				<ChevronLeftIcon />
				<span className="hidden sm:block">Previous</span>
			</Button>
			<Button variant="outline">
				{search.page ?? 1} / {pagination.totalPages}
			</Button>
			<Button
				className="w-32"
				disabled={!pagination.hasNext}
				variant="outline"
				onClick={() => {
					navigate({
						to: '.',
						hash: 'reviews',
						search: (prev) => ({
							...prev,
							page: pagination.page + 1,
						}),
					});
				}}
			>
				<span className="hidden sm:block">Next</span>
				<ChevronRightIcon />
			</Button>
		</ButtonGroup>
	);
}
