import { createFileRoute } from '@tanstack/react-router';
import { FormProvider } from 'react-hook-form';
import { UpdateTripForm } from './-form';
import { useUpdateTripForm } from './-hooks';

export const Route = createFileRoute('/trips/$id/edit/')({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useUpdateTripForm();

	return (
		<FormProvider {...form}>
			<UpdateTripForm />
		</FormProvider>
	);
}
