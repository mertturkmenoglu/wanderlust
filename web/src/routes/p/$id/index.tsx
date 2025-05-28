import { ErrorComponent } from '@/components/blocks/error-component';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import Amenities from './-components/amenities';
import Breadcrumb from './-components/breadcrumb';
import { Description } from './-components/description';
import { Header } from './-components/header';
import { ImageGrid } from './-components/image-grid';
import Map from './-components/map';
import NearbyPois from './-components/nearby-pois';
import Reviews from './-components/reviews';

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

      <Amenities />

      <Separator className="my-4" />

      <NearbyPois />

      <Separator className="my-4" />

      <Reviews />
    </main>
  );
}
