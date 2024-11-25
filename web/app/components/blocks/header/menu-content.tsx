import { Link } from "react-router";
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
          <Link to="/notifications">Notifications</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link to={`/u/${username}/following`} className="cursor-pointer">
            Friends
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/bookmarks">Bookmarks</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/lists">My Lists</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/diary">Diary</Link>
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
      <DropdownMenuSeparator />
      <Logout />
    </DropdownMenuContent>
  );
}
