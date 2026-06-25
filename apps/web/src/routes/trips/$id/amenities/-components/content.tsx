import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useTripAmenitiesContext } from './context';
import { Edit } from './edit';
import { Info } from './info';
import { View } from './view';

export function Content() {
	const ctx = useTripAmenitiesContext();

	return (
		<div className="mt-4 flex flex-col gap-4">
			<Info />

			{ctx.isEditMode ? (
				<SuspenseWrapper>
					<Edit />
				</SuspenseWrapper>
			) : (
				<View />
			)}
		</div>
	);
}
