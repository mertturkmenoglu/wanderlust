import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/blocks/Header";

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
        <body className={"mx-4 md:mx-8 lg:mx-16 2xl:mx-32 " + inter.className}>
          <Header className="my-4" />

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
