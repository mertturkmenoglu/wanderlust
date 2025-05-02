import AppMessage from '@/components/blocks/app-message';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/users/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AppMessage emptyMessage="In progress" showBackButton={false} />
    </div>
  );
}
