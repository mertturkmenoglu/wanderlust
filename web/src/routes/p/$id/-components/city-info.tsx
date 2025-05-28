import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';

type Props = {
  className?: string;
};

export function CityInfo({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();

  return (
    <div className={cn(className)}>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 md:col-span-2">
          <img
            src={ipx(poi.address.city.image.url, 'f_webp,w_1024')}
            alt=""
            className="rounded-md object-cover aspect-video"
          />
        </div>

        <div className="col-span-5 md:col-span-3">
          <h2 className="text-6xl font-bold">{poi.address.city.name}</h2>
          <div className="mt-2 text-sm text-muted-foreground">
            {poi.address.city.state.name}/{poi.address.city.country.name}
          </div>
          <div className="mt-4 text-lg text-muted-foreground">
            {poi.address.city.description}
          </div>
        </div>
      </div>
    </div>
  );
}
