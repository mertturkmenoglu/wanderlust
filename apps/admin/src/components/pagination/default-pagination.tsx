import { useNavigate } from '@tanstack/react-router';
import type { Outputs } from '@/lib/orpc';
import { Pagination } from '.';

type Props = {
	pagination: Outputs['reviews']['listByPlaceId']['pagination'];
};

export function DefaultPagination(props: Props) {
	const { pagination } = props;
	const navigate = useNavigate();

	return (
		<Pagination
			className="mx-auto my-4"
			hasNextPage={pagination.hasNext}
			hasPreviousPage={pagination.hasPrevious}
			page={pagination.page}
			totalPages={pagination.totalPages}
			onNextClick={() =>
				navigate({
					to: '.',
					search: (prev) => ({
						...prev,
						page: Math.min(pagination.page + 1, pagination.totalPages),
					}),
				})
			}
			onPrevClick={() =>
				navigate({
					to: '.',
					search: (prev) => ({
						...prev,
						page: Math.max(pagination.page - 1, 1),
					}),
				})
			}
		/>
	);
}
