import { Button } from '@wanderlust/ui/components/button';
import { ScrollArea } from '@wanderlust/ui/components/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@wanderlust/ui/components/sheet';
import { FilterIcon } from 'lucide-react';
import React from 'react';
import { useCurrentRefinements } from 'react-instantsearch';
import { CustomSearchBox } from '@/components/custom-search-box';
import { Filters } from './filters';
import { Results } from './results';

const MemoizedFilters = React.memo(function MFilters() {
	return <Filters />;
});

export function Container() {
	const { items } = useCurrentRefinements();
	const refinementCount = items
		.map((group) => group.refinements.length)
		.reduce((acc, x) => acc + x, 0);

	const inner = <MemoizedFilters />;

	return (
		<>
			<CustomSearchBox isSearchOnType />

			<div className="my-8 flex flex-col gap-8 md:flex-row">
				<Sheet>
					<SheetTrigger className="md:hidden" asChild>
						<Button variant="secondary">
							<FilterIcon className="size-4" />
							<span className="ml-2">Filters ({refinementCount})</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<SheetHeader>
							<SheetTitle>Select filters</SheetTitle>
							<SheetDescription>
								<ScrollArea className="h-[95vh] pr-4">{inner}</ScrollArea>
							</SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>

				<div className="hidden min-w-[256px] md:block">{inner}</div>

				<div className="w-full">
					<Results />
				</div>
			</div>
		</>
	);
}
