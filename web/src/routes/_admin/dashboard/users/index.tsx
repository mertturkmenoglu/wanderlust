import AppMessage from '@/components/blocks/app-message';
import { buttonVariants } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/users/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <AppMessage emptyMessage="In progress" showBackButton={false} />
      <Link
        to="/dashboard/users/verify"
        className={buttonVariants({ variant: 'link' })}
      >
        Make User Verified
      </Link>
    </div>
  );
}
