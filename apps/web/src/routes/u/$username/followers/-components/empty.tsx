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
				<EmptyTitle>No followers</EmptyTitle>
				<EmptyDescription>This user has no followers yet.</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
