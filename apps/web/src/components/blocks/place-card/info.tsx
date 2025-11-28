import { StarIcon } from 'lucide-react';
import { usePlaceCardContext } from './context';

export function Info() {
	const { place, rating } = usePlaceCardContext();

	return (
		<>
			<div className="mt-2">
				<div className="flex items-baseline justify-between gap-2">
					<div className="line-clamp-1 font-semibold text-lg capitalize">
						{place.name}
					</div>

					{rating !== '0.0' && (
						<div className="flex items-center gap-1">
							<span className="font-medium text-sm">{rating}</span>
							<StarIcon className="size-3 fill-primary text-primary" />
						</div>
					)}
				</div>

				<div className="line-clamp-1 text-muted-foreground text-sm">
					{place.address.city.name} / {place.address.city.country.name}
				</div>
			</div>

			<div className="mt-1">
				<div className="text-primary text-sm">{place.category.name}</div>
			</div>
		</>
	);
}
