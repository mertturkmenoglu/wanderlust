import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type Props = {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	page: number;
	totalPages: number;
	className?: string;
	onPrevClick: () => void;
	onNextClick: () => void;
};

export function Pagination({
	hasNextPage,
	hasPreviousPage,
	page,
	totalPages,
	className,
	onPrevClick,
	onNextClick,
}: Props) {
	return (
		<ButtonGroup className={cn(className)}>
			<Button
				disabled={!hasPreviousPage}
				variant="outline"
				className="w-32"
				onClick={onPrevClick}
			>
				<ChevronLeftIcon />
				Previous
			</Button>
			<Button variant="outline">
				{totalPages > 0 ? page : 0} / {totalPages}
			</Button>
			<Button
				disabled={!hasNextPage}
				variant="outline"
				className="w-32"
				onClick={onNextClick}
			>
				Next
				<ChevronRightIcon />
			</Button>
		</ButtonGroup>
	);
}
