import { AppMessage } from '@/components/app-message';

export function Loading() {
	return (
		<AppMessage
			emptyMessage="Loading..."
			showBackButton={false}
			className="my-16"
		/>
	);
}
