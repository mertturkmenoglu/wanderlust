import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage
			errorMessage="Something went wrong"
			showBackButton={false}
			className="my-4"
		/>
	);
}
