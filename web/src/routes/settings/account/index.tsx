import FacebookIcon from '@/components/icons/facebook';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/account/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Account</h2>

      <div className="grid grid-cols-3 gap-4 mt-4 items-center">
        <Label htmlFor="email">Email</Label>
        <div className="col-span-2 flex">
          <Input id="name" disabled={true} value={auth.user?.email} />
          <Button variant="link" disabled>
            Change
          </Button>
        </div>

        <Label htmlFor="username">Username</Label>
        <div className="col-span-2 flex">
          <Input id="username" disabled={true} value={auth.user?.username} />
          <Button variant="link" disabled>
            Change
          </Button>
        </div>

        <Label htmlFor="password">Password</Label>
        <div className="col-span-2 flex">
          <Input id="password" disabled={true} value="********" />
          <Button variant="link" disabled>
            Change
          </Button>
        </div>

        <Separator className="my-4 col-span-full" />

        <Label>Social Logins</Label>
        <div className="col-span-2 flex gap-4">
          <Button variant="outline" disabled={auth.user?.googleId === null}>
            <GoogleIcon className="size-4" />
          </Button>
          <Button variant="outline" disabled={auth.user?.facebookId === null}>
            <FacebookIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
