import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { Logo } from '@/components/logo';

export function EmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<Logo variant="default" grayscale />
				</EmptyMedia>
				<EmptyTitle>No reviews yet</EmptyTitle>
				<EmptyDescription>
					This user has not yet written any reviews.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
