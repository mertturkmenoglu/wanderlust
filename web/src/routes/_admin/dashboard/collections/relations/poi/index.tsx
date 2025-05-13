import AppMessage from '@/components/blocks/app-message';
import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircleIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute(
  '/_admin/dashboard/collections/relations/poi/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [collectionId, setCollectionId] = useState('');
  const [poiId, setPoiId] = useState('');
  const invalidator = useInvalidator();

  const mutation = api.useMutation(
    'post',
    '/api/v2/collections/{id}/poi/{poiId}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Relation added');
      },
    },
  );

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Collections', href: '/dashboard/collections' },
          {
            name: 'Collection - POI Relations',
            href: '/dashboard/collections/relations/poi',
          },
        ]}
      />

      <Separator className="my-2" />
      <div className="flex items-center justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <PlusIcon className="size-4" />
              <span className="ml-2">New</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Add new relation</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  placeholder="Collection ID"
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                />
                <Input
                  placeholder="Poi ID"
                  className="mt-4"
                  value={poiId}
                  onChange={(e) => setPoiId(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button asChild>
                <AlertDialogAction
                  onClick={() => {
                    mutation.mutate({
                      params: {
                        path: {
                          id: collectionId,
                          poiId,
                        },
                      },
                    });
                  }}
                >
                  Add
                </AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Content />
    </div>
  );
}

function Content() {
  const query = api.useQuery('get', '/api/v2/collections/poi/all');
  // const invalidator = useInvalidator();
  // const mutation = api.useMutation(
  //   'delete',
  //   '/api/v2/collections/{id}/poi/{poiId}',
  //   {
  //     onSuccess: async () => {
  //       toast.success('Relation removed');
  //       await invalidator.invalidate();
  //     },
  //   },
  // );

  if (query.error) {
    return <AppMessage errorMessage="Something went wrong" />;
  }

  if (query.data) {
    if (query.data.collections.length === 0) {
      return <AppMessage emptyMessage="No data" showBackButton={false} />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        {query.data.collections.map(() => (
          <div
            // key={`${item.id}-${item.}`}
            className="border border-border p-6 rounded-md"
          >
            {/* <div>
              <span className="font-bold">Collection ID:</span>
              {item.collectionId}
            </div>
            <div>
              <span className="font-bold">Poi ID:</span>
              {item.poiId}
            </div>
            <div>
              <span className="font-bold">Index:</span>
              {item.index}
            </div> */}
            <Button
              variant="destructive"
              size="icon"
              className="mt-2"
              onClick={() => {
                // mutation.mutate({
                //   collectionId: item.collectionId,
                //   poiId: item.poiId,
                // });
              }}
            >
              <TrashIcon className="size-4" />
              <span className="sr-only">Remove relation</span>
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <LoaderCircleIcon className="mx-auto animate-spin text-primary size-8 my-16" />
  );
}
