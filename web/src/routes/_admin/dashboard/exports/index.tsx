import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { exportsCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/_admin/dashboard/exports/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/export/'),
    ),
});

function RouteComponent() {
  const { exports } = Route.useLoaderData();
  const sorted = exports.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Exports', href: '/dashboard/exports' }]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <Link
          to="/dashboard/exports/new"
          className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
        >
          New Export
        </Link>
      </DashboardActions>

      <DataTable
        columns={exportsCols}
        filterColumnId="id"
        data={sorted.map((e) => ({
          ...e,
          itemCount: e.ids.length,
          progress: `${e.progress}%`,
          error: e.error ? 'See' : '-',
          createdAt: formatDistanceToNow(new Date(e.createdAt)) + ' ago',
        }))}
      />
    </div>
  );
}
