import { AppMessage } from '@/components/app-message';
import { Header } from './-header';

export function ErrorState() {
	return (
		<div>
			<Header />

			<AppMessage
				errorMessage="An error occurred while fetching the invites."
				showBackButton={false}
				className="my-8"
			/>
		</div>
	);
}
