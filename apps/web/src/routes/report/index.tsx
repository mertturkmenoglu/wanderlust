import { createFileRoute } from '@tanstack/react-router';
import { FormProvider } from 'react-hook-form';
import { authGuard } from '@/lib/auth';
import { Content } from './-content';
import { ReportContextProvider } from './-context';
import { searchSchema, useReportForm } from './-hooks';

export const Route = createFileRoute('/report/')({
	component: RouteComponent,
	beforeLoad: authGuard,
	validateSearch: searchSchema,
});

function RouteComponent() {
	const form = useReportForm();

	return (
		<ReportContextProvider>
			<FormProvider {...form}>
				<Content />
			</FormProvider>
		</ReportContextProvider>
	);
}
