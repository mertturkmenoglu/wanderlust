import { DashboardActions } from '@/components/blocks/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/dashboard/ingest/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Ingest', href: '/dashboard/ingest' }]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <Link
          to="/dashboard/ingest/map"
          className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
        >
          Bounding Box
        </Link>
      </DashboardActions>

      <div className="mt-4">
        <Alert>
          <AlertTitle>Select an action</AlertTitle>
          <AlertDescription>
            Select an action to start the ingest process.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
