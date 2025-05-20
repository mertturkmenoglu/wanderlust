import AppMessage from '@/components/blocks/app-message';
import { getRouteApi } from '@tanstack/react-router';

export function ViewAmenities() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();

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
    <ul className="mt-4 list-disc grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 list-inside">
      {trip.requestedAmenities.map((amenity) => (
        <li
          key={amenity.id}
          className="text-sm text-muted-foreground"
        >
          {amenity.name}
        </li>
      ))}
    </ul>
  );
}
