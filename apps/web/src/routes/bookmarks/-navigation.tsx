import { useNavigate } from '@tanstack/react-router';
import { Pagination } from '@/components/pagination';
import { useBookmarksContext } from './-context';
import { useBookmarksQuery } from './-hooks';

export function Navigation() {
	const query = useBookmarksQuery();
	const pagination = query.data.pagination;
	const navigate = useNavigate({ from: '/bookmarks/' });
	const ctx = useBookmarksContext();

	return (
		<Pagination
			pagination={pagination}
			onPrevClick={() => {
				ctx.setIndex(0);
				navigate({
					to: '.',
					search: (prev) => ({
						...prev,
						page: pagination.page - 1,
					}),
				});
			}}
			onNextClick={() => {
				ctx.setIndex(0);
				navigate({
					to: '.',
					search: (prev) => ({
						...prev,
						page: pagination.page + 1,
					}),
				});
			}}
		/>
	);
}
