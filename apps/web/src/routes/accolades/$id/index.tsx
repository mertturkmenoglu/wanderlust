import { createFileRoute } from '@tanstack/react-router';
import { BackLink } from '@/components/back-link';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { accoladePlacesListSearchSchema } from '@/schemas/accolade-places';
import { AccoladePlacesList } from './-list';

export const Route = createFileRoute('/accolades/$id/')({
	component: RouteComponent,
	validateSearch: accoladePlacesListSearchSchema,
	loaderDeps: ({ search }) => {
		return {
			page: search.page ?? 1,
			pageSize: search.pageSize ?? 10,
		};
	},
	loader: ({ context, params, deps }) => {
		return context.queryClient.ensureQueryData(
			orpc.accolades.get.queryOptions({
				input: {
					id: params.id,
					page: deps.page,
					pageSize: deps.pageSize,
				},
			}),
		);
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {
				title: 'Accolade Not Found',
				meta: [
					{
						name: 'description',
						content: 'Accolade not found',
					},
				],
			};
		}

		const accolade = loaderData.accolade;

		const description =
			accolade.description ?? `Explore ${accolade.title} on Wanderlust`;

		return seo({
			title: accolade.title,
			description,
			applicationName: 'Wanderlust',
			openGraph: {
				title: accolade.title,
				type: 'website',
				url: `/accolades/${accolade.id}`,
				locale: 'en_US',
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
				description,
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: accolade.title,
				description,
				images: [
					{
						url: '/logo.png',
						alt: 'Wanderlust',
					},
				],
			},
		});
	},
});

function RouteComponent() {
	const { accolade } = Route.useLoaderData();
	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<img
				src={ipx(accolade.image, 'w_1024')}
				alt=""
				className="aspect-5/2 w-full rounded object-cover md:aspect-9/2"
			/>

			<BackLink to="/accolades" text="See all accolades" className="mt-4" />
			<div className="text-2xl">{accolade.title}</div>
			<div>{accolade.description}</div>
			<SuspenseWrapper>
				<AccoladePlacesList />
			</SuspenseWrapper>
		</div>
	);
}
