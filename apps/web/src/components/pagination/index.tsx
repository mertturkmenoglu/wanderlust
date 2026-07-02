import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	ButtonGroup,
	ButtonGroupText,
} from '@wanderlust/ui/components/button-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { Outputs } from '@/lib/orpc';

type TPagination = Outputs['reviews']['listByPlaceId']['pagination'];

type Props = {
	pagination: TPagination;
	className?: string;
	onPrevClick?: () => void;
	onNextClick?: () => void;
};

export function Pagination({
	pagination,
	className,
	onPrevClick,
	onNextClick,
}: Props) {
	const navigate = useNavigate();

	const next = onNextClick
		? onNextClick
		: () => {
				navigate({
					to: '.',
					search: (prev) => ({
						...prev,
						page: Math.min(pagination.page + 1, pagination.totalPages),
					}),
				});
			};

	const prev = onPrevClick
		? onPrevClick
		: () => {
				navigate({
					to: '.',
					search: (prev) => ({
						...prev,
						page: Math.max(pagination.page - 1, 1),
					}),
				});
			};

	return (
		<ButtonGroup className={cn(className)}>
			<Button
				disabled={!pagination.hasPrevious}
				variant="outline"
				className="w-32"
				onClick={prev}
			>
				<ChevronLeftIcon />
				Previous
			</Button>

			<ButtonGroupText>
				{pagination.totalPages > 0 ? pagination.page : 0} /{' '}
				{pagination.totalPages}
			</ButtonGroupText>

			<Button
				disabled={!pagination.hasNext}
				variant="outline"
				className="w-32"
				onClick={next}
			>
				Next
				<ChevronRightIcon />
			</Button>
		</ButtonGroup>
	);
}
