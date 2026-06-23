import { createFileRoute } from '@tanstack/react-router';
import { FormProvider } from 'react-hook-form';
import { PreferencesForm } from './-form';
import { usePreferencesForm } from './-hooks';

export const Route = createFileRoute('/settings/preferences/')({
	component: RouteComponent,
});

function RouteComponent() {
	const form = usePreferencesForm();

	return (
		<FormProvider {...form}>
			<PreferencesForm />
		</FormProvider>
	);
}
