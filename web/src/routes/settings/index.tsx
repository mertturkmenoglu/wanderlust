import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
  loader: () => {
    throw redirect({
      to: '/settings/account',
    });
  },
});

function RouteComponent() {
  return <></>;
}
