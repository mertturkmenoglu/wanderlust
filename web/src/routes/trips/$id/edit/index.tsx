import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/trips/$id/edit/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const invalidator = useInvalidator();
  const navigate = useNavigate();

  const deleteTripMutation = api.useMutation('delete', '/api/v2/trips/{id}', {
    onSuccess: async () => {
      await invalidator.invalidate();
      await navigate({
        to: '/trips',
      });
      toast.success('Trip deleted');
    },
  });

  return (
    <div>
      <Button
        variant="destructive"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          if (
            confirm(
              'Are you sure you want to delete this trip? This action is irreversible.',
            )
          ) {
            deleteTripMutation.mutate({
              params: {
                path: {
                  id,
                },
              },
            });
          }
        }}
      >
        Delete Trip
      </Button>
    </div>
  );
}
