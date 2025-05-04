import AppMessage from '@/components/blocks/app-message';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/u/$username/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AppMessage emptyMessage="In progress" showBackButton={false} />;
}
