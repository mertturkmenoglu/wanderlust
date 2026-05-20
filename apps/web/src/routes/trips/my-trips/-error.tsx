import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage
			errorMessage="An error occurred while fetching your trips."
			showBackButton={false}
			className="my-8"
		/>
	);
}
