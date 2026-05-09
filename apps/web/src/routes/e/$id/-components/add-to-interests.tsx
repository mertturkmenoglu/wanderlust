import { Button } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { StarIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInvalidator } from '@/hooks/use-invalidator';
import { authClient } from '@/lib/auth';

export function AddToInterestsButton() {
	// const route = getRouteApi('/p/$id/');
	// const { place, meta } = route.useLoaderData();
	const [added, setAdded] = useState(false);
	const invalidate = useInvalidator();
	const session = authClient.useSession();

	const onClick = () => {
		if (!session.data?.user) {
			toast.warning('You need to be signed in.');
			return;
		}
	};

	return (
		<Button variant="default" onClick={onClick}>
			<StarIcon
				className={cn('size-6 text-white', {
					'fill-white': added,
				})}
			/>
			<span>{added ? 'Remove from interests' : "I'm interested"}</span>
		</Button>
	);
}
