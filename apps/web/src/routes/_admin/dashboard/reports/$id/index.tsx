import { DashboardActions } from '@/components/blocks/dashboard/actions';
import { DashboardBreadcrumb } from '@/components/blocks/dashboard/breadcrumb';
import { keyValueCols } from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { DeleteDialog } from '@/components/blocks/dashboard/delete-dialog';
import { Spinner } from '@/components/kit/spinner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import {
  createFileRoute,
  Link,
  linkOptions,
  useNavigate,
} from '@tanstack/react-router';
import { useMemo } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_admin/dashboard/reports/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/reports/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

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

function RouteComponent() {
  const { report } = Route.useLoaderData();

  const link = useMemo(() => {
    if (report.resourceType === 'poi') {
      return linkOptions({
        to: '/p/$id',
        params: {
          id: report.resourceId,
        },
      });
    }

    return linkOptions({
      to: '.',
    });
  }, [report.resourceId, report.resourceType]);

  const invalidator = useInvalidator();
  const navigate = useNavigate();

  const deleteMutation = api.useMutation('delete', '/api/v2/reports/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      await navigate({ to: '/dashboard/reports' });
      toast.success('Report deleted');
    },
  });

  const updateMutation = api.useMutation('patch', '/api/v2/reports/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Report updated');
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Reports', href: '/dashboard/reports' },
          {
            name: 'Detail',
            href: `/dashboard/reports/${report.id}`,
          },
        ]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2 mt-4">
          <Link
            {...link}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Go to Resource
          </Link>
          <Button
            variant="outline"
            size="sm"
            disabled={updateMutation.isPending || report.resolved}
            onClick={() => {
              updateMutation.mutate({
                params: {
                  path: {
                    id: report.id,
                  },
                },
                body: {
                  reason: report.reason,
                  resolved: true,
                  description: report.description ?? '',
                },
              });
            }}
          >
            {updateMutation.isPending && <Spinner className="size-4" />}
            Mark as Resolved
          </Button>

          <DeleteDialog
            type="report"
            onClick={() => {
              deleteMutation.mutate({
                params: {
                  path: {
                    id: report.id,
                  },
                },
              });
            }}
          />
        </div>
      </DashboardActions>

      <DataTable
        columns={keyValueCols}
        filterColumnId=""
        data={[
          {
            k: 'ID',
            v: report.id,
          },
          {
            k: 'Resource ID',
            v: report.resourceId,
          },
          {
            k: 'Resource Type',
            v: report.resourceType,
          },
          {
            k: 'Reporter ID',
            v: report.reporterId ?? '-',
          },
          {
            k: 'Description',
            v: report.description ?? '-',
          },
          {
            k: 'Reason',
            v: getReason(report.reason),
          },
          {
            k: 'Resolved',
            v: report.resolved ? 'Yes' : 'No',
          },
          {
            k: 'Resolved At',
            v: report.resolvedAt ?? '-',
          },
          {
            k: 'Created At',
            v: report.createdAt,
          },
          {
            k: 'Updated At',
            v: report.updatedAt,
          },
        ]}
      />
    </div>
  );
}
