import { Hits } from 'react-instantsearch';
import { Hit } from './hit';
import { HitsPerPage } from './hits-per-page';
import { SearchPagination as Pagination } from './pagination';

export function Results() {
	return (
		<>
			<div className="flex w-full items-center justify-between">
				<div className="font-semibold text-2xl tracking-tight">Results</div>
				<HitsPerPage />
			</div>
			<hr className="my-4" />
			<Hits
				hitComponent={Hit}
				classNames={{
					list: 'space-y-4',
				}}
			/>
			<Pagination />
		</>
	);
}
