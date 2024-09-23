import { Link } from "@remix-run/react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import Logout from "./logout";

type Props = {
  fullName: string;
  username: string;
};

export default function MenuContent({ fullName, username }: Readonly<Props>) {
  return (
    <DropdownMenuContent className="w-56" align="end">
      <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to={`/u/${username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link to={`/schedule`} className="cursor-pointer">
            Schedule
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/overview">Overview</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/services">Services</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/bookmarks">Bookmarks</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/lists">Lists</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to={`/help`} className="cursor-pointer">
          Help
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link to="/privacy">Privacy</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link to="/terms">Terms</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link to="/contact">Contact Us</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <Logout />
    </DropdownMenuContent>
  );
}
