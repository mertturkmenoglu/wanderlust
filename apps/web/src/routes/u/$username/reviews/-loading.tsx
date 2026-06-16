import { AppMessage } from '@/components/app-message';

export function Loading() {
	return <AppMessage empty="Loading..." classNames={{ root: 'my-16' }} />;
}
