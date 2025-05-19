import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';

type Props = {
  className?: string;
};

export function DetailColumn({ className }: Props) {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();

  return (
    <div className={cn(className)}>
      <div className="text-2xl">{trip.title}</div>
      <div className="text-xs text-muted-foreground mt-1">
        Created by: {trip.owner.fullName}
      </div>

      <Separator className="my-2" />

      <pre className="mt-8">{JSON.stringify(trip, null, 2)}</pre>
    </div>
  );
}
