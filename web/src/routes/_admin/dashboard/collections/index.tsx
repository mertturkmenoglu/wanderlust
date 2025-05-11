import { collectionsCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/collections/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/collections/'),
    );
  },
});

function shortDescription(str: string) {
  if (str.length > 64) {
    return str.slice(0, 64) + '...';
  }

  return str;
}

function RouteComponent() {
  const { collections } = Route.useLoaderData();

  return (
    <div>
      <div className="flex items-baseline gap-8 mb-8">
        <h3 className="text-lg font-bold tracking-tight">Collections</h3>
        <Button asChild variant="link" className="px-0">
          <Link to="/dashboard/collections/new">New Collection</Link>
        </Button>
      </div>

      <DataTable
        columns={collectionsCols}
        data={collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
          description: shortDescription(collection.description),
          createdAt: new Date(collection.createdAt).toLocaleDateString(),
        }))}
        hrefPrefix="/dashboard/collections"
      />
    </div>
  );
}
