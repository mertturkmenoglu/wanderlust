import BackLink from '@/components/blocks/back-link';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import DeleteDialog from './-delete-dialog';
import StepsIndicator from './-steps-indicator';
import Step1 from './-steps/step-1';
import Step2 from './-steps/step-2';
import Step3 from './-steps/step-3';
import Step4 from './-steps/step-4';
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

  return (
    <div className="mx-auto">
      <BackLink
        href="/dashboard/pois/drafts"
        text="Go back to the drafts page"
      />
      <div className="flex items-end gap-8 mt-4">
        <h2 className="text-4xl font-bold tracking-tight">{name}</h2>
        <DeleteDialog id={draft.id as string} />
      </div>

      <Separator className="my-4" />

      <StepsIndicator draftId={draft.id as string} />

      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
      {/* {step === 5 && <Step5 />} */}
      {step === 6 && <Step6 />}
    </div>
  );
}
