import { createFileRoute } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';
import { seo } from '@/lib/seo';
import { EmptyState } from './-empty';
import { Header } from './-header';
import { useCollectionQuery } from './-hooks';
import { Items } from './-items';

export const Route = createFileRoute('/collections/$id/')({
	component: RouteComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			orpc.collections.get.queryOptions({
				input: {
					id: params.id,
				},
			}),
		);
	},
	head: ({ loaderData }) => {
		if (!loaderData) {
			return {
				title: 'Collection Not Found',
				meta: [
					{
						name: 'description',
						content: 'Collection not found',
					},
				],
			};
		}

		const collection = loaderData.collection;

		const description =
			collection.description ?? `Explore ${collection.name} on Wanderlust`;

		return seo({
			title: collection.name,
			description,
			applicationName: 'Wanderlust',
			openGraph: {
				title: collection.name,
				type: 'website',
				url: `/collections/${collection.id}`,
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
				title: collection.name,
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
	const query = useCollectionQuery();
	const { collection } = query.data;
	const isEmpty = collection.items.length === 0;

	return (
		<div className="mx-auto mt-8 w-full max-w-7xl md:mt-16">
			<Header />

			{isEmpty && <EmptyState />}

			<Items className="mt-8" />
		</div>
	);
}
