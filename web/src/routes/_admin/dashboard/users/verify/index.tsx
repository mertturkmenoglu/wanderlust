import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_admin/dashboard/users/verify/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [username, setUsername] = useState('');
  const mutation = api.useMutation(
    'post',
    '/api/v2/users/{username}/make-verified',
    {
      onSuccess: () => {
        toast.success('User is now verified');
      },
      onError: (err) => {
        toast.error(err.title ?? 'Something went wrong');
      },
    },
  );

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Users', href: '/dashboard/users' },
          {
            name: 'Verify',
            href: '/dashboard/users/verify',
          },
        ]}
      />
      <Separator className="my-2" />

      <Input
        type="text"
        value={username}
        className="max-w-[512px]"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button
        onClick={() => {
          mutation.mutate({
            params: {
              path: {
                username,
              },
            },
          });
        }}
        className="mt-4"
      >
        Make User Verified
      </Button>
    </div>
  );
}
