import { AppMessage } from '@/components/app-message';

export function EmptyState() {
	return (
		<AppMessage
			empty="There are no items in this collection"
			classNames={{ root: 'mt-8' }}
		/>
	);
}
