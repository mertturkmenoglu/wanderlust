import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@wanderlust/ui/components/alert';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { ParticipantsInfo } from './-components/participants-info';

export const Route = createFileRoute('/trips/$id/participants')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-8 md:flex-row">
			<div className="w-full md:max-w-sm lg:max-w-md">
				<Alert variant="default" fill="ghost">
					<CircleQuestionMarkIcon />
					<AlertDescription>
						<ParticipantsInfo />
					</AlertDescription>
				</Alert>
			</div>

			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
