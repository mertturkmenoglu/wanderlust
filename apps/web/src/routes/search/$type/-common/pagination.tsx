import { useNavigate } from '@tanstack/react-router';
import { usePagination } from 'react-instantsearch';
import { Pagination } from '@/components/pagination';

export function SearchPagination() {
	const pagination = usePagination();
	const previousPageIndex = pagination.currentRefinement - 1;
	const nextPageIndex = pagination.currentRefinement + 1;
	const navigate = useNavigate({ from: '/search/$type/' });

	return (
		<div className="my-4 flex flex-row justify-center">
			<Pagination
				pagination={{
					hasNext: !pagination.isLastPage,
					hasPrevious: !pagination.isFirstPage,
					page: pagination.currentRefinement + 1,
					totalPages: pagination.nbPages,
					pageSize: pagination.nbHits,
					totalRecords: 0,
				}}
				onPrevClick={() => {
					pagination.refine(previousPageIndex);
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: previousPageIndex,
						}),
					});
				}}
				onNextClick={() => {
					pagination.refine(nextPageIndex);
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: nextPageIndex,
						}),
					});
				}}
			/>
		</div>
	);
}
