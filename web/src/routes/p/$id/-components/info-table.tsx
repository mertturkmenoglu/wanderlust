import FormattedRating from '@/components/kit/formatted-rating';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getRouteApi } from '@tanstack/react-router';
import { ExternalLinkIcon } from 'lucide-react';
import OpenHoursDialog from './open-hours-dialog';

function useWebsiteHostname(s: string): [string, boolean] {
  try {
    const url = new URL(s);
    return [url.hostname, true];
  } catch (e) {
    return ['', false];
  }
}

export default function InformationTable() {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const [host, ok] = useWebsiteHostname(poi.website ?? '');

  function calculateRating() {
    if (poi.totalVotes === 0) return 0;
    return poi.totalPoints / poi.totalVotes;
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="px-0 font-medium">Rating</TableCell>
          <TableCell className="flex items-center justify-end">
            <FormattedRating
              rating={calculateRating()}
              votes={poi.totalVotes}
            />
          </TableCell>
        </TableRow>

        {poi.website && ok && (
          <TableRow>
            <TableCell className="px-0 font-medium">Website</TableCell>
            <TableCell className="text-right flex items-center gap-1 justify-end">
              <a
                href={poi.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{host}</span>
                <ExternalLinkIcon className="size-3" />
              </a>
            </TableCell>
          </TableRow>
        )}

        {poi.phone && (
          <TableRow>
            <TableCell className="px-0 font-medium">Phone</TableCell>
            <TableCell className="text-right">
              <a
                href={`tel:${poi.phone}`}
                className="text-primary hover:underline"
              >
                {poi.phone}
              </a>
            </TableCell>
          </TableRow>
        )}

        <TableRow>
          <TableCell className="px-0 font-medium">Address</TableCell>
          <TableCell className="text-right">
            {poi.address.line1}
            <br />
            {poi.address.line2}
            <br />
            {poi.address.city.name}, {poi.address.city.state.name} /{' '}
            {poi.address.city.country.name}
            <br />
            {poi.address.postalCode}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="px-0 font-medium">Price level</TableCell>
          <TableCell className="mt-1 flex justify-end">
            <Progress
              value={poi.priceLevel * 19.8}
              className="max-w-32"
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="px-0 font-medium">
            Accessibility level
          </TableCell>
          <TableCell className="mt-1 flex justify-end">
            <Progress
              value={poi.accessibilityLevel * 19.8}
              className="max-w-32"
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="px-0 font-medium"></TableCell>
          <TableCell className="mt-1 flex justify-end">
            <OpenHoursDialog />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
