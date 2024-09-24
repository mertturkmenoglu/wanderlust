import { Progress } from "~/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { GetPoiByIdResponseDto } from "~/lib/dto";

type Props = {
  poi: GetPoiByIdResponseDto;
};

export default function InformationTable({ poi }: Props) {
  function calculateRating() {
    if (poi.totalVotes === 0) return 0;
    return poi.totalPoints / poi.totalVotes;
  }

  return (
    <Table>
      <TableBody>
        {poi.website && (
          <TableRow>
            <TableCell className="px-0 font-medium">Website</TableCell>
            <TableCell className="text-right">
              <a
                href={poi.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {poi.website}
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
            {poi.address.city.name}, {poi.address.city.stateName} /{" "}
            {poi.address.city.countryName}
            <br />
            {poi.address.postalCode}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="px-0 font-medium">Price level</TableCell>
          <TableCell className="mt-1 flex justify-end">
            <Progress value={poi.priceLevel * 19.8} className="max-w-32" />
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
      </TableBody>
    </Table>
  );
}
