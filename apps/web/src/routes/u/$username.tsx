import { createFileRoute, Outlet } from '@tanstack/react-router';
import { authGuard } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { Header } from './-components/header';

export const Route = createFileRoute('/u/$username')({
	component: RouteComponent,
	beforeLoad: authGuard,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			orpc.users.get.queryOptions({
				input: {
					username: params.username,
				},
			}),
		);
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {
				title: 'User Not Found',
				meta: [
					{
						name: 'description',
						content: 'User not found',
					},
				],
			};
		}

		const user = loaderData;
		const description =
			user.profile.bio ??
			`${user.profile.name} (@${user.profile.username}) on Wanderlust`;

		const { meta, links } = seo({
			title: `${user.profile.name} (@${user.profile.username})`,
			description,
			applicationName: 'Wanderlust',
			openGraph: {
				title: `${user.profile.name} (@${user.profile.username})`,
				type: 'profile',
				url: `/u/${user.profile.username}`,
				locale: 'en_US',
				images: [
					{
						url: user.profile.image ?? '',
						alt: `${user.profile.name} (@${user.profile.username})`,
					},
				],
				description,
				siteName: 'Wanderlust',
				username: user.profile.username,
				firstName: user.profile.name.split(' ')[0],
				lastName: user.profile.name.split(' ').slice(1).join(' '),
			},
			twitter: {
				card: 'summary_large_image',
				title: `${user.profile.name} (@${user.profile.username})`,
				description,
				images: [user.profile.image ?? ''],
			},
		});

		return {
			meta,
			links,
		};
	},
});

function RouteComponent() {
	return (
		<div className="mx-auto w-full max-w-7xl">
			<Header className="mt-8" />
			<Outlet />
		</div>
	);
}
