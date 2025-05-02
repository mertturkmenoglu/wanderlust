import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
// import { useVerifyUserMutation } from './-hooks';

export const Route = createFileRoute('/_admin/dashboard/users/verify/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [username, setUsername] = useState('');
  // const mutation = useVerifyUserMutation();

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold tracking-tight">
        Make User Verified
      </h3>

      <Input
        type="text"
        value={username}
        className="max-w-[512px]"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button
        // onClick={() => {
        //   mutation.mutate(username);
        // }}
        disabled
        className="mt-4"
      >
        Make User Verified
      </Button>
    </div>
  );
}
