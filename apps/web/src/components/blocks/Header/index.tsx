import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/icon.png";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import LogoutItem from "./logout-item";

type Props = React.HTMLAttributes<HTMLElement>;

async function Header({ className, ...props }: Props) {
  const user = await currentUser();

  return (
    <header
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <Link href="/">
        <Image src={Logo} alt="Wanderlust" className="size-12" />
      </Link>

      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/discover/locations"
              className="hover:bg-muted px-4 py-2 rounded-full block"
            >
              Locations
            </Link>
          </li>
          <li>
            <Link
              href="/discover/events"
              className="hover:bg-muted px-4 py-2 rounded-full block"
            >
              Events
            </Link>
          </li>
        </ul>
      </nav>
      <ClerkLoading>
        <Skeleton className="size-8 rounded-full px-10 bg-muted" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton>
            <Button variant="default" className="rounded-full">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" variant="ghost">
                <UserIcon className="size-6 text-black" />
                <span className="ml-2">{user?.firstName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href={`/user/${user?.username}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/notifications">Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/friends">Friends</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/lists">My Lists</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/diary">Diary</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Report</DropdownMenuItem>
              <DropdownMenuItem disabled>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>Privacy</DropdownMenuItem>
              <DropdownMenuItem disabled>Terms</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
      </ClerkLoaded>
    </header>
  );
}

export default Header;
