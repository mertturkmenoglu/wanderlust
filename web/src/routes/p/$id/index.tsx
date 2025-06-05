import { ErrorComponent } from '@/components/blocks/error-component';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import Amenities from './-components/amenities';
import Breadcrumb from './-components/breadcrumb';
import { CityInfo } from './-components/city-info';
import { Collections } from './-components/collections';
import { Description } from './-components/description';
import { Header } from './-components/header';
import { ImageGrid } from './-components/image-grid';
import { Information } from './-components/information';
import Map from './-components/map';
import { NearbyPois } from './-components/nearby-pois';
import Reviews from './-components/reviews';

const schema = z.object({
  page: z.number().min(1).max(100).optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxRating: z.number().min(0).max(5).optional(),
  sortBy: z.enum(['created_at', 'rating']).optional(),
  sortOrd: z.enum(['asc', 'desc']).optional(),
});

export const Route = createFileRoute('/p/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/pois/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
  errorComponent: ErrorComponent,
  validateSearch: schema,
});

function RouteComponent() {
  return (
    <main className="max-w-7xl mx-auto mt-8 md:mt-16">
      <Breadcrumb />

      <Header className="mt-8" />

      <ImageGrid className="mt-8" />

      <Description className="mt-8" />

      <Separator className="my-4" />

      <Map />

      <Separator className="my-4" />

      <CityInfo className="my-4" />

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-2 my-4">
        <Amenities className="col-span-2" />

        <Information />
      </div>

      <Separator className="my-4" />

      <NearbyPois className="my-4" />

      <Separator className="my-4" />

      <Reviews />

      <Separator className="my-4" />

      <Collections className="my-4" />
    </main>
  );
}
