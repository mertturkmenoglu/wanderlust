import { Link } from "@remix-run/react";
import { EllipsisVertical, FlagIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
  userId: string;
};

export default function BioDropdown({ userId }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="block">
        <Button
          className="flex items-center justify-center"
          variant="outline"
          size="icon"
        >
          <EllipsisVertical className="size-6 text-black" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 space-y-2 p-2" align="end">
        <DropdownMenuItem className="cursor-pointer p-0">
          <Button
            className="flex w-full justify-start hover:no-underline"
            variant="link"
            size="sm"
            asChild
          >
            <Link to={`/report?id=${userId}&type=user`}>
              <FlagIcon className="mr-2 size-4" />
              Report
            </Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
