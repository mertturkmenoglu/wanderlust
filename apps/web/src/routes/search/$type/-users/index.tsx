import { Results } from '../-common/results';
import { SearchBox } from '../-common/search-box';
import { TypeSelector } from '../-common/type-selector';

export function UsersContainer() {
	return (
		<>
			<TypeSelector />

			<SearchBox className="my-4" />

			<div className="mt-8 w-full">
				<Results
					type="users"
					classNames={{
						list: 'grid grid-cols-1 gap-4 md:grid-cols-2',
					}}
				/>
			</div>
		</>
	);
}
