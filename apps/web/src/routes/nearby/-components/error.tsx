import { Button } from '@wanderlust/ui/components/button';
import { AppMessage } from '@/components/app-message';

type Props = {
	message?: string;
	refetch?: () => void;
};

export function ErrorComponent({ message, refetch }: Props) {
	return (
		<div className="flex flex-col items-center justify-center">
			<AppMessage
				emptyMessage={message ?? 'Give permission to access your location'}
				showBackButton={false}
				className="mt-32"
			/>
			<Button variant="link" className="mb-32" onClick={refetch}>
				Retry
			</Button>
		</div>
	);
}
