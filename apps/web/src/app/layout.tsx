import Footer from '@/components/blocks/Footer';
import Header from '@/components/blocks/Header';
import { Toaster } from '@/components/ui/sonner';
import ClerkProvider from '@/providers/clerk-provider';
import { CSPostHogProvider } from '@/providers/ph-provider';
import QClientProvider from '@/providers/query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wanderlust',
  description: 'Inspiring explorations, one spark of Wanderlust!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CSPostHogProvider>
          <body
            className={'mx-4 md:mx-8 lg:mx-16 2xl:mx-32 ' + inter.className}
          >
            <QClientProvider>
              <Header className="my-4" />
              <main>{children}</main>
              <Toaster richColors />
              <ReactQueryDevtools />
              <Footer />
            </QClientProvider>
          </body>
        </CSPostHogProvider>
      </html>
    </ClerkProvider>
  );
}
