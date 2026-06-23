import { createFileRoute } from '@tanstack/react-router';
import { BackLink } from '@/components/back-link';
import { FormContent } from './-components/form-content';
import { LhsBanner } from './-components/lhs-banner';

export const Route = createFileRoute('/trips/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto w-full max-w-7xl">
			<BackLink to="/trips" text="Go back to trips" />

			<div className="mt-8 flex flex-row items-start gap-4">
				<LhsBanner className="hidden w-sm md:flex" />

				<FormContent className="flex-1" />
			</div>
		</div>
	);
}
