import { AppMessage } from '@/components/app-message';

export function EmptyState() {
	return (
		<AppMessage
			emptyMessage="There are no items in this collection"
			showBackButton={false}
			className="mt-8"
		/>
	);
}
