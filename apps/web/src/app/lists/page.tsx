import EmptyContent from '@/components/blocks/EmptyContent';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Lists</h2>
        <Button
          asChild
          size="sm"
          variant="default"
        >
          <Link href="/lists/new">
            <span>New List</span>
            <Plus className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
      <hr className="my-2" />
      <div className="my-16">
        <EmptyContent />
      </div>
    </>
  );
}
