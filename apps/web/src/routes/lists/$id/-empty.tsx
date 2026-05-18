import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { Logo } from '@/components/logo';
import { useIsOwner } from './-hooks';

export function EmptyState() {
	const isOwner = useIsOwner();

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<Logo variant="default" grayscale />
				</EmptyMedia>
				<EmptyTitle>This list is empty.</EmptyTitle>
				<EmptyDescription>
					{isOwner
						? "You haven't added any items yet."
						: 'The squirrels took away the items, I guess.'}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="link" asChild>
					<Link to={isOwner ? '/search' : '/lists'}>
						{isOwner
							? 'Go to the search page to find places to add'
							: 'Go to your lists page'}
					</Link>
				</Button>
			</EmptyContent>
		</Empty>
	);
}
