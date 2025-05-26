import AppMessage from '@/components/blocks/app-message';
import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/users/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Users', href: '/dashboard/users' }]}
      />
      <Separator className="my-2" />

      <DashboardActions>
        <Link
          to="/dashboard/users/verify"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Make User Verified
        </Link>
      </DashboardActions>

      <AppMessage
        emptyMessage="Select an action"
        showBackButton={false}
        className="my-32"
      />
    </div>
  );
}
