import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_auth/verify-email/')({
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
  const { auth } = Route.useRouteContext();
  const [isSent, setIsSent] = useState(false);

  const sendVerificationEmailMutation = api.useMutation(
    'post',
    '/api/v2/auth/verify-email/send',
    {
      onSuccess: async () => {
        setIsSent(true);
        toast.success('Verification email sent');
      },
    },
  );

  return (
    <div className="mx-auto my-32 flex max-w-lg flex-col py-8">
      <h2 className="mt-4 text-xl font-bold">Verify Email</h2>
      <div className="text-sm text-muted-foreground">
        Please verify your email address to start using Wanderlust.
      </div>
      <Button
        onClick={() => {
          sendVerificationEmailMutation.mutate({
            body: {
              email: auth.user?.email ?? '',
            },
          });
        }}
        className="mt-4"
        disabled={isSent || sendVerificationEmailMutation.isPending}
      >
        Click to send verification email
      </Button>
    </div>
  );
}
