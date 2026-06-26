import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@wanderlust/ui/components/alert';
import { Badge } from '@wanderlust/ui/components/badge';
import { CircleQuestionMarkIcon } from 'lucide-react';
import type { FileRouteTypes } from '@/routeTree.gen';

export const Route = createFileRoute('/trips/$id/participants')({
	component: RouteComponent,
});

type ValidRouteId = FileRouteTypes['id'];

const listPage: ValidRouteId = '/trips/$id/participants/';

const invitesPage: ValidRouteId = '/trips/$id/participants/invites/';

const newInvitePage: ValidRouteId = '/trips/$id/participants/invites/new/';

function RouteComponent() {
	const matches = useMatches();

	const lastMatch = matches.at(-1);

	if (!lastMatch) {
		return null;
	}

	return (
		<div className="flex flex-col gap-8 md:flex-row">
			<div className="w-full md:max-w-sm lg:max-w-md">
				<Alert variant="default" fill="ghost">
					<CircleQuestionMarkIcon />
					<AlertDescription>
						{lastMatch.routeId === listPage && (
							<>
								Trip participants are the people who have access to this trip.
								<br />
								<br />
								<Badge variant="secondary" className="capitalize">
									Owner
								</Badge>{' '}
								is the person who created the trip and has full control over it.
								<br />
								<br />
								<Badge variant="secondary" className="capitalize">
									Editor
								</Badge>{' '}
								can edit the trip and invite other participants.
								<br />
								<br />
								<Badge variant="secondary" className="capitalize">
									Member
								</Badge>{' '}
								can view the trip but cannot make any changes.
							</>
						)}

						{lastMatch.routeId === invitesPage && (
							<>
								These are the people who have been invited to this trip but have
								not yet accepted the invitation.
								<br />
								<br />
								You can resend the invitation or revoke it if you no longer want
								them to have access.
								<br />
								<br />
								You can also invite new participants by clicking the "Invite"
								button.
							</>
						)}

						{lastMatch.routeId === newInvitePage && (
							<>
								You can invite new participants to this trip by entering their
								usernames.
								<br />
								<br />
								They will receive an invitation to join the trip and will be
								able to view and/or edit it based on the role you assign them.
							</>
						)}
					</AlertDescription>
				</Alert>
			</div>

			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
