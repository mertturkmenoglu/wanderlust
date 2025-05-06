import BackLink from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/pois/$id/')({
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
});

function RouteComponent() {
  const { poi } = Route.useLoaderData();

  return (
    <div>
      <BackLink
        href="/dashboard/pois"
        text="Go back to point of interests page"
      />

      <img
        src={ipx(poi.media[0]?.url ?? '', 'w_512')}
        alt={poi.media[0]?.alt}
        className="mt-4 w-64 rounded-md aspect-video object-cover"
      />

      <h2 className="text-4xl font-bold mt-4">{poi.name}</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <Button variant="outline" asChild>
          <Link
            to="/p/$id"
            params={{
              id: poi.id,
            }}
          >
            Visit Page
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link
            to="/dashboard/pois/$id/edit"
            params={{
              id: poi.id,
            }}
          >
            Edit
          </Link>
        </Button>
      </div>

      <Separator className="my-4 max-w-md" />

      <div className="flex gap-2 mt-4">
        <div className="font-semibold">Poi Id:</div>
        <div>{poi.id}</div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="font-semibold">All Details:</div>
        <pre className="max-w-3xl break-words flex-wrap text-wrap whitespace-pre-wrap">
          {JSON.stringify(poi, null, 2)}
        </pre>
      </div>
    </div>
  );
}
