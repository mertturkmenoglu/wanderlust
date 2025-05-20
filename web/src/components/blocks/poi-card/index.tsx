import type { components } from '@/lib/api-types';
import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';

type P = components['schemas']['Poi'];
type M = components['schemas']['Media'];

type Props = {
  poi: Pick<P, 'id' | 'name' | 'category' | 'address'> & {
    image: Pick<M, 'url' | 'alt'>;
  };
} & React.HTMLAttributes<HTMLDivElement>;

export default function PoiCard({ poi, className, ...props }: Props) {
  return (
    <div
      key={poi.id}
      className={cn('group', className)}
      {...props}
    >
      <img
        src={ipx(poi.image.url, 'w_512')}
        alt={poi.image.alt}
        className="aspect-video w-full rounded-md object-cover"
      />

      <div className="my-2">
        <div className="mt-2 line-clamp-1 text-lg font-semibold capitalize">
          {poi.name}
        </div>
        <div className="line-clamp-1 text-sm text-muted-foreground">
          {poi.address.city.name} / {poi.address.city.country.name}
        </div>
      </div>

      <div>
        <div className="flex-1 space-y-2">
          <div className="text-sm text-primary">{poi.category.name}</div>
        </div>
      </div>
    </div>
  );
}
