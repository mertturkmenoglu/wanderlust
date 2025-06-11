// oxlint-disable prefer-await-to-then
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { reportsCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Spinner } from '@/components/kit/spinner';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Suspense } from 'react';
import { z } from 'zod';

const schema = z.object({
  page: z.coerce.number().catch(1),
  pageSize: z.coerce.number().multipleOf(10).catch(10),
  resourceType: z.string().catch(''),
  reason: z.coerce.number().catch(0),
  reporterId: z.string().catch(''),
  resolved: z.boolean().catch(false),
});

export const Route = createFileRoute('/_admin/dashboard/reports/')({
  component: RouteComponent,
  validateSearch: schema,
});

function RouteComponent() {
  return (
    <div>
      <DashboardBreadcrumb
        items={[{ name: 'Reports', href: '/dashboard/reports' }]}
      />

      <Separator className="my-2" />

      <Suspense
        fallback={
          <div className="my-32">
            <Spinner className="size-12 mx-auto" />
          </div>
        }
      >
        <Content />
      </Suspense>
    </div>
  );
}

const reasons = [
  {
    id: 1,
    name: 'Spam',
  },
  {
    id: 2,
    name: 'Inappropriate',
  },
  {
    id: 3,
    name: 'Fake',
  },
  {
    id: 4,
    name: 'Other',
  },
];

function getReason(r: number) {
  return reasons.find((x) => x.id === r)?.name ?? 'Other';
}

function Content() {
  const search = Route.useSearch();
  const query = api.useSuspenseQuery('get', '/api/v2/reports/search', {
    params: {
      query: search,
    },
  });

  return (
    <div>
      <DataTable
        columns={reportsCols}
        filterColumnId="description"
        data={query.data.reports.map((r) => ({
          id: r.id,
          resourceId: r.resourceId,
          resourceType: r.resourceType,
          reporterId: r.reporterId,
          description:
            (r.description?.length ?? 0) > 10
              ? r.description?.slice(0, 10) + '...'
              : r.description,
          reason: getReason(r.reason),
          resolved: r.resolved ? 'Yes' : 'No',
          resolvedAt:
            r.resolvedAt === null
              ? '-'
              : `${formatDistanceToNow(new Date(r.resolvedAt))} ago`,
          createdAt: `${formatDistanceToNow(new Date(r.createdAt))} ago`,
          updatedAt: `${formatDistanceToNow(new Date(r.updatedAt))} ago`,
        }))}
        hrefPrefix="/dashboard/reports"
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {query.data.reports.length} of{' '}
          {query.data.pagination.totalRecords} reports
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Link
            to="."
            search={(prev) => {
              let page = 1;

              if (prev.page) {
                page = prev.page === 1 ? 1 : prev.page - 1;
              }

              return {
                ...prev,
                page,
              };
            }}
            className={cn('flex items-center gap-2', {
              'cursor-not-allowed opacity-50':
                !query.data.pagination.hasPrevious,
            })}
          >
            <ChevronLeftIcon className="size-4" />
            Previous
          </Link>

          <Link
            to="."
            search={(prev) => {
              let page = 1;

              if (prev.page) {
                page =
                  prev.page === query.data.pagination.totalPages
                    ? prev.page
                    : prev.page + 1;
              }

              return {
                ...prev,
                page,
              };
            }}
            className={cn('flex items-center gap-2', {
              'cursor-not-allowed opacity-50': !query.data.pagination.hasNext,
            })}
          >
            Next
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
