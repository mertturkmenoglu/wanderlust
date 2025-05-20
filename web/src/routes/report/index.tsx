import { WipComponent } from '@/components/blocks/wip';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/report/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <WipComponent />;
}
