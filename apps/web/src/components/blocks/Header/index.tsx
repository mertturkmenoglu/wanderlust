import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/icon.png";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLElement>;

function Header({ className, ...props }: Props): React.ReactElement {
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
        <Skeleton className="size-8 rounded-full" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton showName={false} />
        </SignedIn>
      </ClerkLoaded>
    </header>
  );
}

export default Header;
