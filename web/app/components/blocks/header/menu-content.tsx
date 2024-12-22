import { Link } from "react-router";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import Logout from "./logout";
import {
  BellIcon,
  BookMarkedIcon,
  BookmarkIcon,
  CircleHelpIcon,
  ListIcon,
  LockIcon,
  MapIcon,
  ScaleIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

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
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to={`/u/${username}`}>
            <UserIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to="/notifications">
            <BellIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">Notifications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to="/settings">
            <SettingsIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to="/trips">
            <MapIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">Trips</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to={`/u/${username}/following`}>
            <UsersIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">Friends</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to="/bookmarks">
            <BookmarkIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">Bookmarks</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to="/lists">
            <ListIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">My Lists</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer group focus:bg-primary/10"
        >
          <Link to="/diary">
            <BookMarkedIcon className="size-4 group-focus:text-primary" />
            <span className="ml-2 group-focus:text-primary">Diary</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        asChild
        className="cursor-pointer group focus:bg-primary/10"
      >
        <Link to="/help">
          <CircleHelpIcon className="size-4 group-focus:text-primary" />
          <span className="ml-2 group-focus:text-primary">Help</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        asChild
        className="cursor-pointer group focus:bg-primary/10"
      >
        <Link to="/privacy">
          <LockIcon className="size-4 group-focus:text-primary" />
          <span className="ml-2 group-focus:text-primary">Privacy</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        asChild
        className="cursor-pointer group focus:bg-primary/10"
      >
        <Link to="/terms">
          <ScaleIcon className="size-4 group-focus:text-primary" />
          <span className="ml-2 group-focus:text-primary">Terms</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <Logout />
    </DropdownMenuContent>
  );
}
