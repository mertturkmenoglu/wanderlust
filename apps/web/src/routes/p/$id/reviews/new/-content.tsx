import { Button } from '@wanderlust/ui/components/button';
import { PlusIcon } from 'lucide-react';
import { CreateReviewForm } from './-form';

export function Content() {
	return (
		<>
			<h2 className="font-medium text-2xl">Write a Review</h2>

			<hr />

			<CreateReviewForm />

			<Button
				type="submit"
				form="create-review-form"
				className="mt-4 w-full max-w-48 self-end"
			>
				Create
				<PlusIcon />
			</Button>
		</>
	);
}
