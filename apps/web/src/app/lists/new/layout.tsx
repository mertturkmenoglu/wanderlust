import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export default function Layout({
  children,
}: PropsWithChildren): React.ReactElement {
  return (
    <div>
      <div className="flex flex-col justify-start">
        <Button
          asChild
          variant="link"
          className="w-min px-0"
        >
          <Link href="/lists">
            <ChevronLeft className="mr-2 size-4" />
            <span>Lists</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">Create a List</h2>
      </div>
      <hr className="my-2" />
      <div className="my-16">{children}</div>
    </div>
  );
}
