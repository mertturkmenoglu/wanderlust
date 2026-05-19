import { ReviewsList } from './list';
import { RatingsSection } from './ratings-section';

export function Reviews() {
	return (
		<div className="mt-4 grid grid-cols-1 gap-16 md:grid-cols-3">
			<div className="md:col-span-1">
				<RatingsSection className="sticky top-8" />
			</div>
			<div className="flex flex-col gap-4 md:col-span-2">
				<ReviewsList />
			</div>
		</div>
	);
}
