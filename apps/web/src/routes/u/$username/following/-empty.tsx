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
				<EmptyTitle>No following</EmptyTitle>
				<EmptyDescription>
					This user hasn't followed anyone yet.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
