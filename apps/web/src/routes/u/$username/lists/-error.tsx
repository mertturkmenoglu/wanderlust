import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage
			error="An error occurred while fetching the lists."
			classNames={{ root: 'my-8' }}
		/>
	);
}
