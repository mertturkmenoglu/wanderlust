import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { PencilIcon } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { useIsAuthenticated } from '@/hooks/use-is-authenticated';
import { Content } from './content';
import { CreateReviewContextProvider } from './context';
import { useCreateReviewForm } from './hooks';

export function CreateReviewDialog() {
	const isAuthenticated = useIsAuthenticated();
	const form = useCreateReviewForm();

	if (!isAuthenticated) {
		return (
			<Button variant="default" size="sm" asChild>
				<Link to="/sign-in">
					<PencilIcon className="mr-2 size-4" />
					<span>Add a review</span>
				</Link>
			</Button>
		);
	}

	return (
		<CreateReviewContextProvider>
			<FormProvider {...form}>
				<Content />
			</FormProvider>
		</CreateReviewContextProvider>
	);
}
