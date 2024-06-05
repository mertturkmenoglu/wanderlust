import { Button } from '@/components/ui/button';
import { api, rpc } from '@/lib/api';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

async function getList(id: string) {
  return rpc(() =>
    api.lists[':id'].$get({
      param: {
        id,
      },
    })
  );
}

export default async function Page({ params: { id } }: Props) {
  const list = await getList(id);

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
        <h2 className="text-2xl font-semibold tracking-tight">
          {list.data.name}
        </h2>
      </div>
      <hr className="my-2" />
      <div className="my-16"></div>
    </div>
  );
}
