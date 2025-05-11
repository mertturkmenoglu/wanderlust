import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export default function Step6() {
  const route = getRouteApi('/_admin/dashboard/pois/drafts/$id/');
  const { draft } = route.useLoaderData();
  const navigate = useNavigate();

  const mutation = api.useMutation('post', '/api/v2/pois/drafts/{id}/publish', {
    onSuccess: async () => {
      toast.success('Draft published');
      await navigate({ to: '/dashboard/pois/drafts' });
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.title ?? 'Something went wrong');
    },
  });

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">
        Review & Publish
      </h3>
      <div className="mt-2 text-sm text-muted-foreground">
        Review and publish your draft.
      </div>

      <Button
        onClick={() =>
          mutation.mutate({
            params: {
              path: {
                id: draft.id as any,
              },
            },
          })
        }
        className="my-8"
      >
        Publish
      </Button>

      <Textarea
        rows={50}
        placeholder="Draft data"
        className="mt-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={JSON.stringify(draft, null, 2)}
        readOnly
      />
    </div>
  );
}
