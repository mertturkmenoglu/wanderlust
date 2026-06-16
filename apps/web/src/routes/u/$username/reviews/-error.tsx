import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage
			error="An error occurred while fetching the reviews."
			classNames={{ root: 'my-8' }}
		/>
	);
}
