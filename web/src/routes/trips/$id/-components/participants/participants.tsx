import { ScrollArea } from '@/components/ui/scroll-area';
import { getRouteApi } from '@tanstack/react-router';
import { Item } from './item';

export function ParticipantsContainer() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();

  return (
    <ScrollArea className="h-[200px]">
      <Item
        image={trip.owner.profileImage}
        name={trip.owner.fullName}
        role="Owner"
        username={trip.owner.username}
      />

      {trip.participants.map((p) => (
        <Item
          key={p.id}
          image={p.profileImage}
          name={p.fullName}
          role={p.role}
          username={p.username}
          className="mt-2"
        />
      ))}
    </ScrollArea>
  );
}
