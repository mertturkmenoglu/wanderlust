import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage
			error="An error occurred while fetching the favorites."
			classNames={{ root: 'my-8' }}
		/>
	);
}
