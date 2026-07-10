import { Link, useParams } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { StarPlusIcon } from 'lucide-react';

type Props = {
	className?: string;
};

export function AddReviewLink({ className }: Props) {
	const params = useParams({ from: '/p/$id/' });

	return (
		<Link
			to="/p/$id/reviews/new"
			params={{
				id: params.id,
			}}
			className={buttonVariants({ variant: 'ghost', className })}
		>
			<StarPlusIcon className="size-6 text-primary" />
			<span className="hidden text-primary md:block">Add a review</span>
			<span className="text-primary md:hidden">Review</span>
		</Link>
	);
}
