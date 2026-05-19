import { AppMessage } from '@/components/app-message';

export function EmptyState() {
	return (
		<AppMessage
			emptyMessage="Select a resource and report it"
			backLink="/"
			backLinkText="Back to home"
			showBackButton
		/>
	);
}
