import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Location } from '@/lib/types';

type Props = {
  location: Location;
};

export default function InformationTable({ location }: Props) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Has WiFi</TableCell>
          <TableCell className="text-right">
            {location.hasWifi ? 'Yes' : 'No'}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Phone</TableCell>
          <TableCell className="text-right">{location.phone}</TableCell>
        </TableRow>

        {location.website && (
          <TableRow>
            <TableCell className="font-medium">Website</TableCell>
            <TableCell className="text-right">
              <a
                href={location.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {location.website}
              </a>
            </TableCell>
          </TableRow>
        )}

        <TableRow>
          <TableCell className="font-medium">Address</TableCell>
          <TableCell className="text-right">
            {location.address.line1}
            <br />
            {location.address.line2}
            <br />
            {location.address.city}, {location.address.state} /{' '}
            {location.address.country}
            <br />
            {location.address.postalCode}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Price level</TableCell>
          <TableCell className="mt-1 flex justify-end">
            <Progress
              value={location.priceLevel * 19.8}
              className="max-w-32"
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Accessibility level</TableCell>
          <TableCell className="mt-1 flex justify-end">
            <Progress
              value={location.accessibilityLevel * 19.8}
              className="max-w-32"
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Tags</TableCell>
          <TableCell className="flex flex-col items-end gap-2">
            {location.tags.map((tag) => (
              <Badge
                key={tag}
                className="mr-2"
              >
                {tag}
              </Badge>
            ))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
