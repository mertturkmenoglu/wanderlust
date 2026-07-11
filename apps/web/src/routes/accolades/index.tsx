import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle } from '@wanderlust/ui/components/card';
import { AccoladesBanner } from '@/components/banner/common';
import { Pagination } from '@/components/pagination';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { listAccoladesSearchSchema } from '@/schemas/list-accolades';

export const Route = createFileRoute('/accolades/')({
	component: RouteComponent,
	validateSearch: listAccoladesSearchSchema,
	loaderDeps: ({ search }) => {
		return {
			page: search.page ?? 1,
			pageSize: search.pageSize ?? 10,
		};
	},
	loader: ({ context, deps }) => {
		return context.queryClient.ensureQueryData(
			orpc.accolades.list.queryOptions({
				input: {
					page: deps.page,
					pageSize: deps.pageSize,
				},
			}),
		);
	},
	head: () =>
		seo({
			title: 'Accolades',
			description: 'Browse accolades on Wanderlust',
			applicationName: 'Wanderlust',
			openGraph: {
				title: 'Accolades',
				type: 'website',
				url: '/accolades/',
				locale: 'en_US',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
				description: 'Browse accolades on Wanderlust',
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: 'Accolades',
				description: 'Browse accolades on Wanderlust',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
			},
		}),
});

function RouteComponent() {
	const { accolades, pagination } = Route.useLoaderData();

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<AccoladesBanner showCta={false} />

			<div className="mt-16 text-2xl">Accolades</div>

			<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
				{accolades.map((accolade) => (
					<Link
						key={`accolades-${accolade.id}`}
						to="/accolades/$id"
						params={{
							id: accolade.id,
						}}
					>
						<Card className="relative pt-0">
							<img
								src={ipx(accolade.image, 'w_512')}
								alt=""
								className="relative z-20 aspect-video w-full object-cover"
							/>
							<CardHeader>
								<CardTitle className="line-clamp-1">{accolade.title}</CardTitle>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>

			<Pagination className="mx-auto mt-4" pagination={pagination} />
		</div>
	);
}
