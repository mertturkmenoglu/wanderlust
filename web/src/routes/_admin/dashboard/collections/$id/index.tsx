import BackLink from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import DeleteDialog from '../../../../../components/blocks/dashboard/delete-dialog';

export const Route = createFileRoute('/_admin/dashboard/collections/$id/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/collections/{id}', {
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
  const { collection } = Route.useLoaderData();
  const invalidator = useInvalidator();
  const navigate = useNavigate();
  const mutation = api.useMutation('delete', '/api/v2/collections/{id}', {
    onSuccess: async () => {
      toast.success('Collection deleted');
      await invalidator.invalidate();
      await navigate({
        to: '/dashboard/collections',
      });
    },
    onError: async (e) => {
      toast.error(e.title ?? 'Something went wrong');
    },
  });

  const img = collection.items[0]?.poi.media[0] ?? { url: '', alt: '' };

  return (
    <>
      <BackLink
        href="/dashboard/collections"
        text="Go back to collections page"
      />

      {img.url !== '' && (
        <img
          src={ipx(img.url, 'w_512')}
          alt={img.alt}
          className="mt-4 w-64 rounded-md aspect-video object-cover"
        />
      )}

      <h2 className="text-4xl font-bold mt-4">{collection.name}</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <Button variant="outline" asChild>
          <Link
            to="/c/$id"
            params={{
              id: collection.id,
            }}
          >
            Visit Page
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link
            to="/dashboard/collections/$id/edit"
            params={{
              id: collection.id,
            }}
          >
            Edit
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link
            to="/dashboard/collections/$id/items"
            params={{
              id: collection.id,
            }}
          >
            See Collection Items
          </Link>
        </Button>

        <DeleteDialog
          type="collection"
          onClick={() =>
            mutation.mutate({
              params: {
                path: {
                  id: collection.id,
                },
              },
            })
          }
        />
      </div>

      <Separator className="my-4 max-w-md" />

      <h3 className="mt-4 text-lg font-bold tracking-tight">Short Info</h3>

      <div className="grid grid-cols-12 gap-2 mt-4">
        <div className="font-semibold col-span-1">Id:</div>
        <div className="col-span-11">{collection.id}</div>

        <div className="font-semibold col-span-1">Name:</div>
        <div className="col-span-11">{collection.name}</div>

        <div className="font-semibold col-span-1">Description:</div>
        <div className="col-span-11">{collection.description}</div>

        <div className="font-semibold col-span-1">Created At:</div>
        <div className="col-span-11">
          {new Date(collection.createdAt).toLocaleString()}
        </div>
      </div>
    </>
  );
}
