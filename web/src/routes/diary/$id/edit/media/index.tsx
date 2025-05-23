import { WipComponent } from '@/components/blocks/wip';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/diary/$id/edit/media/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <WipComponent />;
}
