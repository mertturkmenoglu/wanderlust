import { AppMessage } from '@/components/app-message';

export function ErrorState() {
	return (
		<AppMessage error="Something went wrong" classNames={{ root: 'my-4' }} />
	);
}
