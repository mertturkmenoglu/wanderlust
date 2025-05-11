import AppMessage from '@/components/blocks/app-message';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/report/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppMessage
      emptyMessage="We are working on reporting feature. Check later."
      className="my-32"
    />
  );
}
