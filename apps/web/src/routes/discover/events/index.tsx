import { WipComponent } from '@/components/blocks/wip';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/discover/events/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <WipComponent />;
}
