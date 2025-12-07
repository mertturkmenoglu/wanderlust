import { Button } from '@wanderlust/ui/components/button';
import { XIcon } from 'lucide-react';
import { useClearRefinements } from 'react-instantsearch';
import { RefinementList } from './refinement-list';

export function Filters() {
	const { canRefine, refine } = useClearRefinements();

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="font-semibold text-lg tracking-tight underline">
					Filters
				</div>

				<div>
					{canRefine && (
						<Button
							disabled={!canRefine}
							onClick={refine}
							variant="ghost"
							size="sm"
							className=""
						>
							<XIcon className="size-3" />
							<span className="ml-1">Clear</span>
						</Button>
					)}
				</div>
			</div>

			<RefinementList attribute="place.category.name" />

			<RefinementList attribute="place.amenities" />

			<RefinementList attribute="place.priceLevel" />

			<RefinementList attribute="place.accessibilityLevel" />

			<RefinementList attribute="place.address.city.stateName" />

			<RefinementList attribute="place.address.city.name" />

			<RefinementList attribute="place.address.city.countryName" />
		</>
	);
}
