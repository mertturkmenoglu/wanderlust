import { useLoaderData } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { Settings2Icon } from 'lucide-react';
import { AppMessage } from '@/components/app-message';
import { amenitiesDisplayNames } from '@/lib/amenities';
import { useTripAmenitiesContext } from './context';

export function View() {
	const ctx = useTripAmenitiesContext();

	const { trip } = useLoaderData({
		from: '/trips/$id',
	});

	if (trip.requestedAmenities.length === 0) {
		return (
			<AppMessage
				empty="No amenities requested"
				classNames={{ root: 'my-16' }}
			/>
		);
	}

	return (
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
					<Badge key={`trip-amenities-${amenity}`} variant="midnight" size="lg">
						{amenitiesDisplayNames.get(amenity) ?? amenity}
					</Badge>
				))}
			</CardContent>
		</Card>
	);
}
