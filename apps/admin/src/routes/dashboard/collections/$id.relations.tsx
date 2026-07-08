import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import {
	ButtonGroup,
	ButtonGroupText,
} from '@wanderlust/ui/components/button-group';
import { ItemGroup } from '@wanderlust/ui/components/item';
import { ArrowRightIcon } from 'lucide-react';
import z from 'zod';
import { AppMessage } from '@/components/app-message';
import { CityCard } from '@/components/city-card';
import { EditDialog } from '@/components/edit-dialog';
import { PlaceCard } from '@/components/place-card';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { orpc } from '@/lib/orpc';
import { collectionsResource as r } from '@/resources/collections';

export const Route = createFileRoute('/dashboard/collections/$id/relations')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: params.id,
			},
		});
	},
	validateSearch: z.object({
		mode: z.enum(['place', 'city']).optional().catch('place'),
	}),
	staticData: getDefaultStaticData(r, 'edit'),
});

function RouteComponent() {
	const params = Route.useParams();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const mode = search.mode ?? 'place';

	return (
		<EditDialog id={params.id} resource={r}>
			<div className="flex h-full flex-col gap-4">
				<div className="flex flex-row items-stretch justify-start gap-4">
					<ButtonGroup>
						<ButtonGroupText>Show Related:</ButtonGroupText>
						<Button
							variant={mode === 'place' ? 'default' : 'outline'}
							onClick={() => navigate({ search: { mode: 'place' } })}
							className="w-64"
						>
							Places
						</Button>
						<Button
							variant={mode === 'city' ? 'default' : 'outline'}
							onClick={() => navigate({ search: { mode: 'city' } })}
							className="w-64"
						>
							Cities
						</Button>
					</ButtonGroup>
				</div>

				<SuspenseWrapper>
					{mode === 'place' && <ListRelatedPlaces />}

					{mode === 'city' && <ListRelatedCities />}
				</SuspenseWrapper>
			</div>
		</EditDialog>
	);
}

function ListRelatedPlaces() {
	const params = Route.useParams();

	const query = useSuspenseQuery(
		orpc.collections.relations.places.list.queryOptions({
			input: {
				collectionId: params.id,
			},
			staleTime: 1000 * 60 * 5, // 5 minutes
		}),
	);

	const places = query.data.places;
	const isEmpty = places.length === 0;

	if (isEmpty) {
		return (
			<AppMessage
				emptyMessage="This collection is not featured on any places yet."
				showBackButton={false}
				className="my-16"
			/>
		);
	}

	return (
		<div className="flex-1">
			<div className="my-4">This collection is featured on these places:</div>
			<ItemGroup className="mt-4 gap-2">
				{places.map((place) => (
					<div
						key={place.id}
						className="flex w-full flex-row items-center gap-4"
					>
						<PlaceCard place={place} variant="item" className="w-full" />
						<Link
							to="/dashboard/places/$id"
							params={{ id: place.id }}
							className={buttonVariants({ variant: 'outline' })}
						>
							View
							<ArrowRightIcon />
						</Link>
					</div>
				))}
			</ItemGroup>
		</div>
	);
}

function ListRelatedCities() {
	const params = Route.useParams();

	const query = useSuspenseQuery(
		orpc.collections.relations.cities.list.queryOptions({
			input: {
				collectionId: params.id,
			},
			staleTime: 1000 * 60 * 5, // 5 minutes
		}),
	);

	const cities = query.data.cities;
	const isEmpty = cities.length === 0;

	if (isEmpty) {
		return (
			<AppMessage
				emptyMessage="This collection is not featured on any cities yet."
				showBackButton={false}
				className="my-16"
			/>
		);
	}

	return (
		<div className="flex-1">
			<div className="my-4">This collection is featured on these cities:</div>
			<ItemGroup className="mt-4 gap-2">
				{cities.map((city) => (
					<div
						key={city.id}
						className="flex w-full flex-row items-center gap-4"
					>
						<CityCard city={city} className="w-full" />
						<Link
							to="/dashboard/cities/$id"
							params={{ id: city.id.toString() }}
							className={buttonVariants({ variant: 'outline' })}
						>
							View
							<ArrowRightIcon />
						</Link>
					</div>
				))}
			</ItemGroup>
		</div>
	);
}
