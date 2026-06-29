import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle } from '@wanderlust/ui/components/card';
import { AccoladesBanner } from '@/components/banner/common';
import { Pagination } from '@/components/pagination';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
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
});

function RouteComponent() {
	const { accolades, pagination } = Route.useLoaderData();
	const navigate = useNavigate({ from: '/accolades/' });

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			<AccoladesBanner showCta={false} />

			<div className="mt-16 text-2xl">Accolades</div>

			<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
				{accolades.map((accolade) => (
					<Link
						to="/accolades/$id"
						params={{
							id: accolade.id,
						}}
					>
						<Card key={`accolades-${accolade.id}`} className="relative pt-0">
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

			<Pagination
				hasNextPage={pagination.hasNext}
				hasPreviousPage={pagination.hasPrevious}
				page={pagination.page}
				totalPages={pagination.totalPages}
				onPrevClick={() => {
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: Math.max(prev.page - 1, 1),
						}),
					});
				}}
				onNextClick={() => {
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: Math.min(prev.page + 1, pagination.totalPages),
						}),
					});
				}}
				className="mx-auto mt-4"
			/>
		</div>
	);
}
