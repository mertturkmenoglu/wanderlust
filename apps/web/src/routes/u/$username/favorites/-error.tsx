import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage
			errorMessage="An error occurred while fetching the favorites."
			showBackButton={false}
			className="my-8"
		/>
	);
}
