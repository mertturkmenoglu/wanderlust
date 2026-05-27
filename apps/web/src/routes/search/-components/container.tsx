import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
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
import { CategoryBannerDisplay } from './category-banner-display';
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
			<CategoryBannerDisplay className="mb-4" />

			<CustomSearchBox isSearchOnType />

			<div className="my-4 flex flex-row items-center gap-4">
				<span className="text-sm">See:</span>
				<Link
					to="/nearby"
					className={buttonVariants({ variant: 'link', className: 'px-0!' })}
				>
					Nearby places
				</Link>

				<Link
					to="/cities/list"
					className={buttonVariants({ variant: 'link', className: 'px-0!' })}
				>
					Cities
				</Link>

				<Link
					to="/categories"
					className={buttonVariants({ variant: 'link', className: 'px-0!' })}
				>
					Categories
				</Link>
			</div>

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
