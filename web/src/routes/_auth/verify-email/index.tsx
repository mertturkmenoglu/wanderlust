import { fetchClient } from '@/lib/api';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/verify-email/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const res = await fetchClient.GET('/api/v2/auth/me');
    if (res.data === undefined) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="mx-auto my-32 flex max-w-lg flex-col py-8">
      <h2 className="mt-4 text-xl font-bold">Verify Email</h2>
      <div className="text-sm text-muted-foreground">
        Please verify your email address to start using Wanderlust.
      </div>
    </div>
  );
}
