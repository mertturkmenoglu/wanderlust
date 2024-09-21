import { getAuth } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import Sidebar from './_components/sidebar';

export default async function Layout({ children }: PropsWithChildren) {
  const auth = await getAuth();

  if (auth?.data === null) {
    redirect('/');
  }

  if (auth?.data.role !== 'admin') {
    redirect('/');
  }

  return (
    <main className="mt-16">
      <div>
        <Link href="/dashboard">
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        </Link>
      </div>
      <div className="my-8 flex flex-col gap-8 md:flex-row">
        <Sidebar className="w-[256px] md:border-r md:border-border" />
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
