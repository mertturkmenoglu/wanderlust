// oxlint-disable prefer-optional-catch-binding
// oxlint-disable no-unused-vars

import { getRouteApi } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OpenHoursDialog } from './open-hours-dialog';

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

	return (
		<div className={cn(className)}>
			<h3 className="font-semibold text-xl tracking-tight">Information</h3>
			<div className="mt-4 grid grid-cols-2 gap-2">
				<div className="font-medium">Address</div>
				<div className="text-muted-foreground text-sm">
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
						<div className="text-muted-foreground text-sm">
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
								className="inline-flex items-center gap-1 text-primary hover:underline"
							>
								<span>{host}</span>
								<ExternalLinkIcon className="size-3 min-h-3 min-w-3" />
							</a>
						</div>
					</>
				)}

				<div />
				<div className="text-right">
					<OpenHoursDialog />
				</div>
			</div>
		</div>
	);
}
