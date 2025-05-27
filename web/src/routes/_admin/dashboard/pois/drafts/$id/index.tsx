import DashboardActions from '@/components/blocks/dashboard/actions';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import DeleteDialog from '@/components/blocks/dashboard/delete-dialog';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import StepsIndicator from './-steps-indicator';
import Step4 from './-steps/step-4';
import Step5 from './-steps/step-5';
import Step6 from './-steps/step-6';

const schema = z.object({
  step: z.number().min(1).max(6).catch(1),
});

export const Route = createFileRoute('/_admin/dashboard/pois/drafts/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/pois/drafts/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
  validateSearch: schema,
});

function getDraftName(draft: any): string {
  if (typeof draft.name === 'string') {
    return draft.name;
  }

  if (typeof draft.id === 'string') {
    return draft.id;
  }

  return 'Unnamed Draft';
}

function RouteComponent() {
  const { draft } = Route.useLoaderData();
  const { step } = Route.useSearch();
  const name = getDraftName(draft);
  const navigate = useNavigate();
  const invalidator = useInvalidator();

  const mutation = api.useMutation('delete', '/api/v2/pois/drafts/{id}', {
    onSuccess: async () => {
      toast.success('Draft deleted');
      await invalidator.invalidate();
      await navigate({
        to: '/dashboard/pois/drafts',
      });
    },
  });

  return (
    <div className="mx-auto">
      <DashboardBreadcrumb
        items={[
          { name: 'Point of Interests', href: '/dashboard/pois' },
          {
            name: 'Drafts',
            href: '/dashboard/pois/drafts',
          },
          {
            name: name,
            href: `/dashboard/pois/drafts/${draft.id}`,
          },
        ]}
      />

      <Separator className="my-2" />

      <DashboardActions>
        <div className="flex items-center gap-2">
          <DeleteDialog
            type="draft"
            onClick={() =>
              mutation.mutate({
                params: {
                  path: {
                    id: draft.id as string,
                  },
                },
              })
            }
          />
        </div>
      </DashboardActions>

      <div className="mt-4">
        <StepsIndicator draftId={draft.id as string} />
      </div>

      {step === 4 && <Step4 />}
      {step === 5 && <Step5 />}
      {step === 6 && <Step6 />}
    </div>
  );
}
