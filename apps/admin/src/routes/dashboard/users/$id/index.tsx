import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Container } from '@/components/container';
import { ObjectDetails } from '@/components/details';
import { DetailRow, DetailTable } from '@/components/details/table';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { authClient } from '@/lib/auth';
import { copyToClipboard } from '@/lib/clipboard';
import { appLink } from '@/lib/link';
import { DangerousActions } from './-dangerous';

export const Route = createFileRoute('/dashboard/users/$id/')({
	component: RouteComponent,
	loader: ({ params }) => {
		return authClient.admin.getUser({
			query: { id: params.id },
		});
	},
	staticData: {
		breadcrumb: (data) => data.data.name,
	},
});

function RouteComponent() {
	const query = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const confirm = useConfirmDialog();

	if (!query.data) {
		return null;
	}

	return (
		<Container>
			{confirm.Dialog}

			<ObjectDetails
				object={{
					id: query.data.id,
					title: query.data.name,
					type: 'user',
					// @ts-expect-error bio is included in the data
					description: query.data.bio,
				}}
				onEdit={() => {
					toast.info('Use the actions below');
				}}
				onVisit={() => {
					navigate({
						// @ts-expect-error username is included in the data
						href: appLink(`/u/${query.data.username}`),
					});
				}}
				onShare={() => {
					// @ts-expect-error username is included in the data
					copyToClipboard(appLink(`/u/${query.data.username}`));
				}}
				onDelete={() => {
					toast.info('Use the actions below');
				}}
			>
				<DetailTable>
					<DetailRow label="ID" value={query.data.id} />
					<DetailRow label="Name" value={query.data.name} />
					<DetailRow label="Email" value={query.data.email} />
					{/* @ts-expect-error Username is included in the data */}
					<DetailRow label="Username" value={query.data.username} />
					<DetailRow
						label="Email Verified"
						value={query.data.emailVerified ? 'Yes' : 'No'}
					/>
					<DetailRow
						label="Role"
						value={query.data.role === 'admin' ? 'Admin' : 'User'}
					/>
					<DetailRow label="Banned" value={query.data.banned ? 'Yes' : 'No'} />
					<DetailRow label="Ban Reason" value={query.data.banReason ?? '—'} />
					<DetailRow
						label="Ban Expires"
						value={
							query.data.banExpires ? query.data.banExpires.toISOString() : '—'
						}
					/>
					<DetailRow
						label="Image"
						value={
							<img
								src={query.data.image ?? ''}
								alt=""
								className="aspect-square size-12"
							/>
						}
					/>
					<DetailRow
						label="Banner"
						value={
							<img
								// @ts-expect-error Banner is valid
								src={query.data.banner ?? ''}
								alt=""
								className="aspect-video w-48"
							/>
						}
					/>
					{/* @ts-expect-error Website is valid */}
					<DetailRow label="Website" value={query.data.website ?? '—'} />
					{/* @ts-expect-error Bio is valid */}
					<DetailRow label="Bio" value={query.data.bio ?? '—'} />
					{/* @ts-expect-error Followers count is valid */}
					<DetailRow label="Followers" value={query.data.followersCount} />
					{/* @ts-expect-error Following count is valid */}
					<DetailRow label="Following" value={query.data.followingCount} />
					<DetailRow
						label="Created At"
						value={query.data.createdAt.toISOString()}
					/>
					<DetailRow
						label="Updated At"
						value={query.data.updatedAt.toISOString()}
					/>
				</DetailTable>

				<DangerousActions className="my-8" />
			</ObjectDetails>
		</Container>
	);
}
