import { createFileRoute } from '@tanstack/react-router';
import { FormProvider } from 'react-hook-form';
import { authGuard } from '@/lib/auth';
import { seo } from '@/lib/seo';
import { Content } from './-content';
import { ReportContextProvider } from './-context';
import { searchSchema, useReportForm } from './-hooks';

export const Route = createFileRoute('/report/')({
	component: RouteComponent,
	validateSearch: searchSchema,
	beforeLoad: authGuard,
	head: () =>
		seo({
			title: 'Report Content',
		}),
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
