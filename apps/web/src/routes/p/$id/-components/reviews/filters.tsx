import { getRouteApi } from '@tanstack/react-router';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { Slider } from '@wanderlust/ui/components/slider';
import { useEffect, useState } from 'react';

export function Filters() {
	const route = getRouteApi('/p/$id/');
	const search = route.useSearch();

	const [isDirty, setIsDirty] = useState(false);
	const [minRating, setMinRating] = useState(
		search.minRating ? search.minRating - 1 : 1,
	);
	const [maxRating, setMaxRating] = useState(search.maxRating ?? 5);
	const [minRateValue, setMinRateValue] = useState(minRating);
	const [maxRateValue, setMaxRateValue] = useState(maxRating);

	const [sortBy, setSortBy] = useState(search.sortBy ?? 'created_at');
	const [sortOrd, setSortOrd] = useState(search.sortOrd ?? 'desc');
	const navigate = route.useNavigate();

	const isAllRatings = minRating === 1 && maxRating === 5;

	useEffect(() => {
		if (isDirty) {
			navigate({
				to: '.',
				hash: 'reviews',
				search: (prev) => ({
					...prev,
					page: 1,
					minRating: minRating - 1,
					maxRating: maxRating,
					sortBy: sortBy,
					sortOrd: sortOrd,
				}),
			});
		}
	}, [isDirty, navigate, minRating, maxRating, sortBy, sortOrd]);

	return (
		<div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-2">
					<div className="font-semibold text-muted-foreground text-sm">
						Rating {isAllRatings ? '' : `(${minRating} - ${maxRating})`}
					</div>
					<Slider
						defaultValue={[1, 5]}
						value={[minRateValue, maxRateValue]}
						onValueChange={([min, max]) => {
							setMinRateValue(min ?? 0);
							setMaxRateValue(max ?? 5);
						}}
						onValueCommit={([min, max]) => {
							setIsDirty(true);
							setMinRating(min ?? 0);
							setMaxRating(max ?? 5);
						}}
						minStepsBetweenThumbs={1}
						max={5}
						min={1}
						step={1}
					/>
				</div>

				<div className="mt-4 font-semibold text-muted-foreground text-sm">
					Sort By
				</div>
				<Select
					defaultValue={`${sortBy === 'created_at' ? 'date' : 'rating'}-${sortOrd}`}
					onValueChange={(v) => {
						const [newSortBy, newSortOrd] = v.split('-');
						setIsDirty(true);
						setSortBy(newSortBy === 'date' ? 'created_at' : 'rating');
						setSortOrd(newSortOrd === 'desc' ? 'desc' : 'asc');
					}}
				>
					<SelectTrigger className="w-full bg-background">
						<SelectValue placeholder="Select a filter" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Date</SelectLabel>
							<SelectItem value="date-desc">Newest first</SelectItem>
							<SelectItem value="date-asc">Oldest first</SelectItem>
						</SelectGroup>
						<SelectSeparator />
						<SelectGroup>
							<SelectLabel>Rating</SelectLabel>
							<SelectItem value="rating-desc">Highest first</SelectItem>
							<SelectItem value="rating-asc">Lowest first</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
