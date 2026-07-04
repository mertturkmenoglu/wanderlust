import { Aside } from './aside';
import { Assets } from './assets';
import { Main } from './main';
import { PlaceInfo } from './place-info';
import { Ratings } from './ratings';

export function Content() {
	return (
		<div>
			<Assets />

			<div className="flex flex-col gap-4 md:flex-row">
				<Aside className="md:w-xs md:min-w-xs">
					<PlaceInfo />
					<Ratings />
				</Aside>

				<Main />
			</div>
		</div>
	);
}
