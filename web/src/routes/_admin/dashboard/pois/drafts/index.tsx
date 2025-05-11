import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import {
  poisDraftsCols,
  type PoiDraft,
} from '@/components/blocks/dashboard/columns';
import { DataTable } from '@/components/blocks/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/_admin/dashboard/pois/drafts/')({
  component: RouteComponent,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/pois/drafts'),
    );
  },
});

function RouteComponent() {
  const { drafts } = Route.useLoaderData();
  const navigate = useNavigate();
  const mutation = api.useMutation('post', '/api/v2/pois/drafts', {
    onSuccess: (data) => {
      toast.success('Draft created');
      let id = data.draft.id;

      if (typeof id !== 'string') {
        throw new Error('id is not a string');
      }

      navigate({
        to: `/dashboard/pois/drafts/$id`,
        params: {
          id,
        },
      });
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Point of Interests', href: '/dashboard/pois' },
          {
            name: 'Drafts',
            href: '/dashboard/pois/drafts',
          },
        ]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              mutation.mutate({});
            }}
          >
            New Draft
          </Button>
        </div>
      </DashboardActions>

      <DataTable
        columns={poisDraftsCols}
        filterColumnId="name"
        data={
          (drafts ?? []).map((draft) => ({
            id: draft.id,
            name: draft.name ?? '-',
            v: draft.v,
          })) as PoiDraft[]
        }
        hrefPrefix="/dashboard/pois/drafts"
      />
    </div>
  );
}
