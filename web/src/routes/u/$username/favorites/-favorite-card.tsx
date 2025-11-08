import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { components } from '@/lib/api-types';
import { ipx } from '@/lib/ipx';

type Props = {
  favorite: components['schemas']['Favorite'];
};

export function FavoriteCard({ favorite: { place } }: Props) {
  const image = place.assets[0];

  return (
    <Card className="group flex flex-col md:flex-row py-0">
      <img
        src={ipx(image?.url ?? '', 'w_512')}
        alt={image?.description ?? ''}
        className="aspect-video w-full rounded-t-md object-cover md:w-32 md:rounded-none md:rounded-l-md lg:w-32 2xl:w-64"
      />

      <div className="py-6 w-full">
        <CardHeader className="w-full">
          <CardTitle
            className="line-clamp-1 capitalize"
            title={place.name}
          >
            {place.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {place.address.city.name} / {place.address.city.country.name}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4">
          <p className="line-clamp-1 text-sm leading-none text-primary">
            {place.category.name}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
