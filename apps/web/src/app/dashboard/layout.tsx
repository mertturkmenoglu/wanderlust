import { canAccessOrg } from '@/lib/org-access';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import Sidebar from './_components/sidebar';

export default function Layout({ children }: PropsWithChildren) {
  auth().protect();
  const ok = canAccessOrg();

  if (!ok) {
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
