import { useLoaderData } from '@tanstack/react-router';
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@wanderlust/ui/components/alert';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { AlertTriangleIcon, Settings2Icon } from 'lucide-react';
import { useMemo } from 'react';
import { AppMessage } from '@/components/app-message';
import { amenitiesDisplayNames } from '@/lib/amenities';
import { useTripAmenitiesContext } from './context';

export function View() {
	const ctx = useTripAmenitiesContext();

	const { trip } = useLoaderData({
		from: '/trips/$id',
	});

	const faultyItems = useMemo(() => {
		return trip.itineraryItems.map((item) => {
			if (item.place === null) {
				return {
					item,
					faulty: false,
					missing: [],
				};
			}

			const placeAmenities = item.place.place.amenities ?? [];
			const missingAmenities = trip.requestedAmenities.filter((amenity) =>
				placeAmenities.includes(`${amenity}.0`),
			);

			return {
				item,
				faulty: missingAmenities.length > 0,
				missing: missingAmenities,
			};
		});
	}, [trip.itineraryItems, trip.requestedAmenities]);

	const showFaulty = useMemo(() => {
		return faultyItems.some((item) => item.faulty);
	}, [faultyItems]);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Requested Amenities</CardTitle>
					{ctx.canEdit && (
						<CardAction>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => ctx.setIsEditMode(true)}
							>
								<Settings2Icon />
								<span>Edit</span>
							</Button>
						</CardAction>
					)}
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					{trip.requestedAmenities.map((amenity) => (
						<Badge
							key={`trip-amenities-${amenity}`}
							variant="midnight"
							size="lg"
						>
							{amenitiesDisplayNames.get(amenity) ?? amenity}
						</Badge>
					))}
					{trip.requestedAmenities.length === 0 && (
						<AppMessage
							empty="No amenities requested"
							classNames={{ root: 'my-4 mx-auto' }}
						/>
					)}
				</CardContent>
			</Card>
			{showFaulty &&
				faultyItems.map(({ item, missing, faulty }) => {
					if (!faulty) {
						return null;
					}

					return (
						<Alert variant="warning">
							<AlertTriangleIcon />
							<AlertTitle>
								{item.title ?? item.place?.place?.name ?? 'Itinerary Item'}
							</AlertTitle>
							<AlertDescription>
								Missing amenities:{' '}
								<div className="flex flex-wrap gap-2">
									{missing.map((amenity) => (
										<Badge
											key={`trip-amenities-faulty-${item.id}-${amenity}`}
											variant="warning"
											size="default"
										>
											{amenitiesDisplayNames.get(amenity) ?? amenity}
										</Badge>
									))}
								</div>
								{/* <pre>
									{JSON.stringify(item.place?.place.amenities ?? [], null, 2)}
								</pre>
								<pre>
									{JSON.stringify(trip.requestedAmenities ?? [], null, 2)}
								</pre> */}
							</AlertDescription>
						</Alert>
					);
				})}
		</>
	);
}
