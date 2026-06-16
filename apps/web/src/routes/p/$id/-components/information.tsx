import { getRouteApi } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	BikeIcon,
	CarFrontIcon,
	ExternalLinkIcon,
	PersonStandingIcon,
	TramFrontIcon,
} from 'lucide-react';

type Props = {
	className?: string;
};

function useWebsiteHostname(s: string): [string, boolean] {
	try {
		const url = new URL(s);
		return [url.hostname, true];
	} catch (_error) {
		return ['', false];
	}
}

export function Information({ className }: Props) {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();
	const [host, ok] = useWebsiteHostname(place.website ?? '');
	const gmDirBase = `https://maps.google.com/?saddr=Current+Location&daddr=${place.address.lat},${place.address.lng}`;

	return (
		<div className={cn(className)}>
			<h3 className="font-semibold text-xl tracking-tight">Information</h3>
			<div className="mt-4 grid grid-cols-2 items-baseline gap-2">
				<div className="font-medium">Address</div>
				<div className="text-muted-foreground text-xs md:text-sm">
					<div className="text-right">
						{place.address.line1} {place.address.line2}
						<br />
						{place.address.city.name}, {place.address.city.stateName} /{' '}
						{place.address.city.countryName}
						<br />
						{place.address.postalCode}
					</div>
				</div>

				{place.phone && (
					<>
						<div className="font-medium">Phone</div>
						<div className="text-muted-foreground text-xs md:text-sm">
							<div className="text-right">{place.phone}</div>
						</div>
					</>
				)}

				{place.website && ok && (
					<>
						<div className="font-medium">Website</div>
						<div className="break-all text-right">
							<a
								href={place.website}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1 text-primary text-xs hover:underline md:text-sm"
							>
								<span>{host}</span>
								<ExternalLinkIcon className="size-3 min-h-3 min-w-3" />
							</a>
						</div>
					</>
				)}
			</div>

			<h3 className="mt-4 font-semibold text-xl tracking-tight">
				How to get here
			</h3>

			<div className="mt-4 grid grid-cols-2 gap-4">
				<a
					href={`${gmDirBase}&mode=transit&dirflg=r`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Item variant="outline" size="sm">
						<ItemMedia variant="icon">
							<TramFrontIcon />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Transit</ItemTitle>
						</ItemContent>
					</Item>
				</a>

				<a
					href={`${gmDirBase}&mode=bicycling&dirflg=b`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Item variant="outline" size="sm">
						<ItemMedia variant="icon">
							<BikeIcon />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Cycling</ItemTitle>
						</ItemContent>
					</Item>
				</a>

				<a
					href={`${gmDirBase}&dirflg=w`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Item variant="outline" size="sm">
						<ItemMedia variant="icon">
							<PersonStandingIcon />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Walking</ItemTitle>
						</ItemContent>
					</Item>
				</a>

				<a href={`${gmDirBase}`} target="_blank" rel="noopener noreferrer">
					<Item variant="outline" size="sm">
						<ItemMedia variant="icon">
							<CarFrontIcon />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Driving</ItemTitle>
						</ItemContent>
					</Item>
				</a>
			</div>
		</div>
	);
}
