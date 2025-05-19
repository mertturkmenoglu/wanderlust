import { getRouteApi } from '@tanstack/react-router';

export function ViewAmenities() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();

  return (
    <ul className="mt-4 list-disc grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 list-inside">
      {trip.requestedAmenities.map((amenity) => (
        <li key={amenity.id}>{amenity.name}</li>
      ))}
    </ul>
  );
}
