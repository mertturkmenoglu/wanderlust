import { useNavigate } from '@tanstack/react-router';
import { usePagination } from 'react-instantsearch';
import { Pagination } from '@/components/pagination';

export function SearchPagination() {
	const { currentRefinement, nbPages, isFirstPage, isLastPage, refine } =
		usePagination();
	const previousPageIndex = currentRefinement - 1;
	const nextPageIndex = currentRefinement + 1;
	const navigate = useNavigate({ from: '/search/' });

	return (
		<div className="my-4 flex flex-row justify-center">
			<Pagination
				hasNextPage={!isLastPage}
				hasPreviousPage={!isFirstPage}
				page={currentRefinement + 1}
				totalPages={nbPages}
				onPrevClick={() => {
					refine(previousPageIndex);
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: previousPageIndex,
						}),
					});
				}}
				onNextClick={() => {
					refine(nextPageIndex);
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
