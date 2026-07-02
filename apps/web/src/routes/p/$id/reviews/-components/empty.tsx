import {
	Empty,
	EmptyContent,
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
				<EmptyTitle>There are no reviews yet.</EmptyTitle>
			</EmptyHeader>
			<EmptyContent>Be the first to leave a review.</EmptyContent>
		</Empty>
	);
}
