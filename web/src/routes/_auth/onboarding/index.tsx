import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/')({
  component: RouteComponent,
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="mx-auto my-32 flex max-w-lg flex-col py-8">
      <h2 className="mt-4 text-xl font-bold">Onboarding</h2>
      <div className="text-sm text-muted-foreground">
        Please complete your onboarding to start using Wanderlust.
      </div>
    </div>
  );
}
