import { createFileRoute } from '@tanstack/react-router';
import { Separator } from '@wanderlust/ui/components/separator';
import z from 'zod';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { Content } from './-content';
import { ModeSwitch } from './-mode-switch';
import { NewRelationDialog } from './-new';

export const Route = createFileRoute(
	'/_admin/dashboard/collections/relations/',
)({
	component: RouteComponent,
	validateSearch: z.object({
		mode: z.enum(['place', 'city']).optional().catch('place'),
	}),
});

function RouteComponent() {
	return (
		<div>
			<DashboardBreadcrumb
				items={[
					{ name: 'Collections', href: '/dashboard/collections' },
					{
						name: 'Relations',
						href: '/dashboard/collections/relations',
					},
				]}
			/>

			<Separator className="my-4" />

			<div className="flex items-center justify-between gap-4">
				<ModeSwitch />

				<NewRelationDialog />
			</div>

			<Content />
		</div>
	);
}
