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
				<EmptyTitle>No favorites yet</EmptyTitle>
				<EmptyDescription>
					{meta.isSelf
						? 'You have not added any place to your favorites yet.'
						: 'This user has not added any places to their favorites yet.'}
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
