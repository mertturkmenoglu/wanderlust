import { createFileRoute } from '@tanstack/react-router';
import { DetailColumn } from './-components/details';

export const Route = createFileRoute('/trips/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <DetailColumn className="w-full col-span-full md:col-span-3" />;
}
