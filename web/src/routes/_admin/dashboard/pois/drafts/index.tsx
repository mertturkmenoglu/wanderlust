import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
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
      <div className="flex gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Drafts</h2>
        <Button
          variant="link"
          className="px-0"
          onClick={() => {
            mutation.mutate({});
          }}
        >
          New Draft
        </Button>
      </div>

      <div className="">
        {(drafts ?? []).map((draft) => (
          <Link
            to="/dashboard/pois/drafts/$id"
            params={{
              id: `${draft.id as number}`,
            }}
            key={(draft.id as string) ?? ''}
          >
            <div className="flex flex-col">
              <div className="font-semibold text-primary">
                {(draft.name as string | null | undefined) ??
                  (draft.id as string)}
              </div>
              <div className="text-sm text-muted-foreground">
                Version: {draft.v as number}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
