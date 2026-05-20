import { useLoaderData } from '@tanstack/react-router';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { Logo } from '@/components/logo';

export function EmptyState() {
	const { meta } = useLoaderData({ from: '/u/$username' });

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<Logo variant="default" grayscale />
				</EmptyMedia>
				<EmptyTitle>No lists yet</EmptyTitle>
				<EmptyDescription>
					{meta.isSelf
						? 'You have not created any lists yet.'
						: 'This user has not created any lists yet.'}
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
