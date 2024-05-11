import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import Image from "next/image";
import Logo from "./icon.png";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wanderlust",
  description: "Inspiring explorations, one spark of Wanderlust!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <header className="flex items-center container mx-auto my-4 justify-between">
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

          <nav className="container mx-auto flex justify-center my-12 items-center space-x-4">
            <input
              className="border border-black/30 w-1/2 py-4 rounded-full px-8"
              placeholder="Search a location or an event"
            />

            <Button size="icon" className="rounded-full size-12">
              <MagnifyingGlassIcon className="size-6" />
            </Button>
          </nav>

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
