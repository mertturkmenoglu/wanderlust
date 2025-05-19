import { createFileRoute, getRouteApi } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();

  return (
    <div className="">
      <pre className="mt-8">{JSON.stringify(trip, null, 2)}</pre>
    </div>
  );
}
