import AppMessage from '@/components/blocks/app-message';
import BackLink from '@/components/blocks/back-link';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';
import DeleteDialog from './-delete-dialog';

export const Route = createFileRoute('/_admin/dashboard/categories/$id/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/categories/'),
    ),
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const { id } = Route.useParams();
  const category = categories.find((category) => category.id === +id);

  if (!category) {
    return (
      <AppMessage errorMessage="Category not found" showBackButton={false} />
    );
  }

  return (
    <div>
      <BackLink
        href="/dashboard/categories"
        text="Go back to categories page"
      />
      <div className="flex items-end gap-4">
        <h2 className="text-4xl font-bold mt-8">{category.name}</h2>
        <Button variant="link" className="px-0" asChild>
          <Link
            to="/dashboard/categories/$id/edit"
            params={{
              id,
            }}
          >
            Edit
          </Link>
        </Button>
        <DeleteDialog id={category.id} />
      </div>
      <img
        src={category.image}
        alt={category.name}
        className="mt-8 w-64 rounded-md aspect-video object-cover"
      />

      <div className="flex gap-2 mt-4">
        <div className="font-semibold">Category Id:</div>
        <div>{category.id}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Category Name:</div>
        <div>{category.name}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="font-semibold">Image URL:</div>
        <div>{category.image}</div>
      </div>
    </div>
  );
}
