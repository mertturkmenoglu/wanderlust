import { WipComponent } from '@/components/blocks/wip';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/discover/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <WipComponent />
    </div>
  );
}
