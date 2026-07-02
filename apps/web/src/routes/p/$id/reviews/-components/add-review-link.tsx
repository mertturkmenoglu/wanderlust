import { Link, useParams } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { PencilIcon } from 'lucide-react';

type Props = {
	className?: string;
};

export function AddReviewLink({ className }: Props) {
	const params = useParams({ from: '/p/$id/reviews/' });

	return (
		<Link
			to="/p/$id/reviews/new"
			params={{
				id: params.id,
			}}
			className={buttonVariants({ variant: 'default', size: 'sm', className })}
		>
			<PencilIcon />
			<span>Add a review</span>
		</Link>
	);
}
