import { auth } from '@clerk/nextjs/server';
import { PropsWithChildren } from 'react';

export default function Layout({
  children,
}: PropsWithChildren): React.ReactElement {
  auth().protect();

  return (
    <main className="container my-16">
      <h2 className="line-clamp-2 scroll-m-20 text-4xl font-extrabold capitalize tracking-tight">
        Your Bookmarks
      </h2>
      <div>{children}</div>
    </main>
  );
}
