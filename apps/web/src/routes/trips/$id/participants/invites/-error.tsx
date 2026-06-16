import { AppMessage } from '@/components/app-message';
import { Header } from './-header';

export function ErrorState() {
	return (
		<div>
			<Header />

			<AppMessage
				error="An error occurred while fetching the invites."
				classNames={{ root: 'my-8' }}
			/>
		</div>
	);
}
