import AppMessage from '@/components/blocks/app-message';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/diary/$id/edit/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppMessage
      emptyMessage="We are working on this feature"
      showBackButton={false}
      className="my-32"
      backLink="/diary"
      backLinkText="Go back to the diary page"
    />
  );
}
