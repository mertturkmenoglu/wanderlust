import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage
			error="An error occurred while fetching your trips."
			classNames={{ root: 'my-8' }}
		/>
	);
}
