import { AppMessage } from '@/components/app-message';

export function EmptyState() {
	return (
		<AppMessage
			empty="Select a resource and report it"
			backLink={{
				to: '/',
				text: 'Back to home',
			}}
		/>
	);
}
