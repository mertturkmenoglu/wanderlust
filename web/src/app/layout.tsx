import Header from '@/components/blocks/header';
import { Toaster } from '@/components/ui/sonner';
import AuthContextProvider from '@/providers/auth-provider';
import QClientProvider from '@/providers/query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['100', '300', '400', '700', '900'],
});

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
    <html lang="en">
      <body className={'mx-4 md:mx-8 lg:mx-16 2xl:mx-32 ' + lato.className}>
        <QClientProvider>
          <AuthContextProvider>
            <Header className="my-4" />
            <main>{children}</main>
            <Toaster richColors />
            <ReactQueryDevtools />
          </AuthContextProvider>
        </QClientProvider>
      </body>
    </html>
  );
}
