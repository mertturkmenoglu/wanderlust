import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import type { TSearchCityHit, TSearchHit, TSearchUserHit } from '@/lib/search';
import { useSearchContext } from './context';

export function ResultsView() {
	const { searchType, variant } = useSearchContext();
	const View = getResultsView(variant, searchType);

	if (!View) {
		return null;
	}

	return <View />;
}

function getResultsView(
	variant: 'global' | 'local',
	searchType: 'places' | 'cities' | 'users',
) {
	if (searchType === 'places' || variant === 'local') {
		return PlacesResultsView;
	}

	if (searchType === 'cities') {
		return CitiesResultsView;
	}

	if (searchType === 'users') {
		return UsersResultsView;
	}

	return null;
}

export function PlacesResultsView() {
	const ctx = useSearchContext();
	const hits = ctx.hits as TSearchHit[];

	return (
		<div>
			{hits.slice(0, 5).map((hit, index) => (
				<Link
					key={`search-result-places-${hit.id}-${index}`}
					to="/p/$id"
					params={{
						id: hit.place.id,
					}}
					onClick={(e) => {
						if (ctx.onItemClick) {
							e.preventDefault();
							e.stopPropagation();
							ctx.onItemClick(hit);
						}
					}}
				>
					<Item className="hover:bg-muted">
						<ItemMedia>
							<Image
								src={ipx(hit.place.assets[0]?.url ?? '', 'w_256')}
								alt={hit.place.name}
								className="aspect-video w-16 rounded object-cover md:w-24"
								layout="constrained"
								width={256}
								aspectRatio={16 / 9}
							/>
						</ItemMedia>

						<ItemContent>
							<ItemTitle>{hit.place.name}</ItemTitle>
							<ItemDescription>
								{hit.place.address.city.name} /{' '}
								{hit.place.address.city.stateName}
							</ItemDescription>
							<ItemDescription className="text-primary">
								{hit.place.category.name}
							</ItemDescription>
						</ItemContent>
					</Item>
				</Link>
			))}
		</div>
	);
}

export function CitiesResultsView() {
	const ctx = useSearchContext();
	const hits = ctx.hits as TSearchCityHit[];

	return (
		<div>
			{hits.slice(0, 5).map((hit, index) => (
				<Link
					key={`search-result-cities-${hit.id}-${index}`}
					to="/cities/$"
					params={{
						_splat: `${hit.city.id}/${hit.city.name}`,
					}}
					onClick={(e) => {
						if (ctx.onItemClick) {
							e.preventDefault();
							e.stopPropagation();
							ctx.onItemClick(hit);
						}
					}}
				>
					<Item className="hover:bg-muted">
						<ItemMedia>
							<Image
								src={ipx(hit.city.image ?? '', 'w_256')}
								alt={hit.city.name}
								className="aspect-video w-16 rounded object-cover md:w-24"
								layout="constrained"
								width={256}
								aspectRatio={16 / 9}
							/>
						</ItemMedia>

						<ItemContent>
							<ItemTitle>{hit.city.name}</ItemTitle>
							<ItemDescription>
								{hit.city.stateName} / {hit.city.countryName}
							</ItemDescription>
						</ItemContent>
					</Item>
				</Link>
			))}
		</div>
	);
}

export function UsersResultsView() {
	const ctx = useSearchContext();
	const hits = ctx.hits as TSearchUserHit[];

	return (
		<div>
			{hits.slice(0, 5).map((hit, index) => (
				<Link
					key={`search-result-users-${hit.id}-${index}`}
					to="/u/$username"
					params={{
						username: hit.username,
					}}
					onClick={(e) => {
						if (ctx.onItemClick) {
							e.preventDefault();
							e.stopPropagation();
							ctx.onItemClick(hit);
						}
					}}
				>
					<Item className="hover:bg-muted">
						<ItemMedia>
							<Image
								src={userImage(hit.image)}
								alt={hit.username}
								className="aspect-video w-16 rounded object-cover md:w-24"
								layout="constrained"
								width={256}
								aspectRatio={16 / 9}
							/>
						</ItemMedia>

						<ItemContent>
							<ItemTitle>{hit.name}</ItemTitle>
							<ItemDescription>@{hit.username}</ItemDescription>
						</ItemContent>
					</Item>
				</Link>
			))}
		</div>
	);
}
