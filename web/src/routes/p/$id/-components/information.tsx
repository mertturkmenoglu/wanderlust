import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';
import OpenHoursDialog from './open-hours-dialog';

type Props = {
  className?: string;
};

function useWebsiteHostname(s: string): [string, boolean] {
  try {
    const url = new URL(s);
    return [url.hostname, true];
  } catch (e) {
    return ['', false];
  }
}

export function Information({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const [host, ok] = useWebsiteHostname(poi.website ?? '');

  return (
    <div className={cn(className)}>
      <h3 className="text-xl font-semibold tracking-tight">Information</h3>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="font-medium">Address</div>
        <div className="text-muted-foreground text-sm">
          <div className="text-right">
            {poi.address.line1} {poi.address.line2}
            <br />
            {poi.address.city.name}, {poi.address.city.state.name} /{' '}
            {poi.address.city.country.name}
            <br />
            {poi.address.postalCode}
          </div>
        </div>

        {poi.phone && (
          <>
            <div className="font-medium">Phone</div>
            <div className="text-muted-foreground text-sm">
              <div className="text-right">{poi.phone}</div>
            </div>
          </>
        )}

        {poi.website && ok && (
          <>
            <div className="font-medium">Website</div>
            <div className="text-right break-all">
              <a
                href={poi.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{host}</span>
                <ExternalLinkIcon className="size-3 min-h-3 min-w-3" />
              </a>
            </div>
          </>
        )}

        <div></div>
        <div className="text-right">
          <OpenHoursDialog />
        </div>
      </div>
    </div>
  );
}
