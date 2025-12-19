import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';

export function EmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<img
						src="/logo.png"
						alt="Wanderlust Logo"
						className="size-24 min-h-24 min-w-24 grayscale"
					/>
				</EmptyMedia>
				<EmptyTitle>No following</EmptyTitle>
				<EmptyDescription>
					This user hasn't followed anyone yet.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
