import { Hits } from 'react-instantsearch';
import { Hit as CityHit } from '../-cities/hit';
import { Hit as PlaceHit } from '../-places/hit';
import { Hit as UserHit } from '../-users/hit';
import { HitsPerPage } from './hits-per-page';
import { SearchPagination as Pagination } from './pagination';

type Props = {
	type: 'places' | 'cities' | 'users';
	classNames?: Partial<{
		root: string | string[];
		emptyRoot: string | string[];
		list: string | string[];
		item: string | string[];
		bannerRoot: string | string[];
		bannerImage: string | string[];
		bannerLink: string | string[];
	}>;
};

export function Results({ type, classNames }: Props) {
	return (
		<>
			<div className="flex w-full items-center justify-between">
				<div className="font-semibold text-2xl tracking-tight">Results</div>
				<HitsPerPage />
			</div>
			<hr className="my-4" />
			<Hits
				hitComponent={
					type === 'places' ? PlaceHit : type === 'cities' ? CityHit : UserHit
				}
				classNames={classNames}
			/>
			<Pagination />
		</>
	);
}
