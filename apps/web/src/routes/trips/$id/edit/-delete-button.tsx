import { useMutation } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { orpc } from '@/lib/orpc';

type Props = {
	className?: string;
};

export function DeleteButton({ className }: Props) {
	const route = getRouteApi('/trips/$id');
	const { id } = route.useParams();
	const invalidate = useInvalidator();
	const navigate = useNavigate();

	const mutation = useMutation(
		orpc.trips.delete.mutationOptions({
			onSuccess: async () => {
				await navigate({
					to: '/trips',
				});
				toast.success('Trip deleted');
				await invalidate();
			},
		}),
	);

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
					mutation.mutate({
						id,
					});
				}
			}}
		>
			<Trash2Icon className="size-4 text-destructive-foreground" />
			<span className="text-destructive-foreground">Delete Trip</span>
		</Button>
	);
}
