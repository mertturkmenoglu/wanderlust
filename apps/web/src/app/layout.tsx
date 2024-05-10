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
                <UserButton showName={true} />
              </SignedIn>
            </ClerkLoaded>
          </header>

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
