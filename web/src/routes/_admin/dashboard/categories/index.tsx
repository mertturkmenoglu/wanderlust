import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/categories/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/categories/'),
    ),
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {categories.map((category) => (
          <Link
            to="/dashboard/categories/$id"
            params={{
              id: `${category.id}`,
            }}
            key={category.id}
          >
            <Button asChild variant="link" className="p-0">
              <div className="font-bold text-wrap">{category.name}</div>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
