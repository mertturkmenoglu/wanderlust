import { useLoaderData } from '@tanstack/react-router';
import { AppMessage } from '@/components/app-message';
import { amenitiesDisplayNames } from '@/lib/amenities';

export function View() {
	const { trip } = useLoaderData({
		from: '/trips/$id',
	});

	if (trip.requestedAmenities.length === 0) {
		return (
			<AppMessage
				emptyMessage="No amenities requested"
				showBackButton={false}
				className="my-16"
			/>
		);
	}

	return (
		<ul className="mt-4 grid list-inside list-disc grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{trip.requestedAmenities.map((amenity) => (
				<li key={amenity} className="text-muted-foreground text-sm">
					{amenitiesDisplayNames.get(amenity) ?? amenity}
				</li>
			))}
		</ul>
	);
}
