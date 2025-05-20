import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  className?: string;
};

export function DeleteButton({ className }: Props) {
  const route = getRouteApi('/trips/$id');
  const { id } = route.useParams();
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
    <Button
      variant="ghost"
      size="sm"
      className={cn(className)}
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
      <Trash2Icon className="size-4 text-destructive-foreground" />
      <span className="text-destructive-foreground">Delete Trip</span>
    </Button>
  );
}
