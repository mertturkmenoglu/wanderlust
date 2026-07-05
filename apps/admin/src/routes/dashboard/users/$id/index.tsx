import { queryOptions } from '@tanstack/react-query';
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

const qopts = (id: string) =>
	queryOptions({
		queryKey: ['user', id],
		queryFn: async () => {
			const res = await authClient.admin.getUser({
				query: { id },
			});

			if (res.error) {
				throw new Error(res.error.message);
			}

			return res.data;
		},
	});

export const Route = createFileRoute('/dashboard/users/$id/')({
	component: RouteComponent,
	loader: ({ params, context }) => {
		return context.qc.ensureQueryData(qopts(params.id));
	},
});

function RouteComponent() {
	const query = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const confirm = useConfirmDialog();

	return (
		<Container title="User Details">
			{confirm.Dialog}

			<ObjectDetails
				object={{
					id: query.id,
					title: query.name,
					type: 'user',
					// @ts-expect-error bio is included in the data
					description: query.bio,
				}}
				onEdit={() => {
					toast.info('Use the actions below');
				}}
				onVisit={() => {
					navigate({
						// @ts-expect-error username is included in the data
						href: appLink(`/u/${query.username}`),
					});
				}}
				onShare={() => {
					// @ts-expect-error username is included in the data
					copyToClipboard(appLink(`/u/${query.username}`));
				}}
				onDelete={() => {
					toast.info('Use the actions below');
				}}
			>
				<DetailTable>
					<DetailRow label="ID" value={query.id} />
					<DetailRow label="Name" value={query.name} />
					<DetailRow label="Email" value={query.email} />
					{/* @ts-expect-error Username is included in the data */}
					<DetailRow label="Username" value={query.username} />
					<DetailRow
						label="Email Verified"
						value={query.emailVerified ? 'Yes' : 'No'}
					/>
					<DetailRow
						label="Role"
						value={query.role === 'admin' ? 'Admin' : 'User'}
					/>
					<DetailRow label="Banned" value={query.banned ? 'Yes' : 'No'} />
					<DetailRow label="Ban Reason" value={query.banReason ?? '—'} />
					<DetailRow
						label="Ban Expires"
						value={query.banExpires ? query.banExpires.toISOString() : '—'}
					/>
					<DetailRow
						label="Image"
						value={
							<img
								src={query.image ?? ''}
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
								src={query.banner ?? ''}
								alt=""
								className="aspect-video w-48"
							/>
						}
					/>
					{/* @ts-expect-error Website is valid */}
					<DetailRow label="Website" value={query.website ?? '—'} />
					{/* @ts-expect-error Bio is valid */}
					<DetailRow label="Bio" value={query.bio ?? '—'} />
					{/* @ts-expect-error Followers count is valid */}
					<DetailRow label="Followers" value={query.followersCount} />
					{/* @ts-expect-error Following count is valid */}
					<DetailRow label="Following" value={query.followingCount} />
					<DetailRow label="Created At" value={query.createdAt.toISOString()} />
					<DetailRow label="Updated At" value={query.updatedAt.toISOString()} />
				</DetailTable>

				<DangerousActions className="my-8" />
			</ObjectDetails>
		</Container>
	);
}
