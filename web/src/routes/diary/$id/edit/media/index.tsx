import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { ipx } from '@/lib/ipx';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import NewImageDialog from './-new';

export const Route = createFileRoute('/diary/$id/edit/media/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/diary/$id/edit');
  const { diary } = route.useLoaderData();
  const invalidator = useInvalidator();

  const deleteMutation = api.useMutation(
    'delete',
    '/api/v2/diary/{id}/image/{imageId}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Image deleted successfully');
      },
    },
  );

  const updateMutation = api.useMutation('patch', '/api/v2/diary/{id}/image', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Image updated successfully');
    },
  });

  return (
    <div className="my-8 max-w-2xl">
      <div className="flex items-baseline justify-between border-b border-border">
        <h3 className="text-lg">Edit Media</h3>
        <NewImageDialog id={diary.id} />
      </div>
      <div className="flex flex-col mt-2">
        {diary.images.length === 0 && (
          <div className="text-sm text-muted-foreground my-8">
            No images added yet
          </div>
        )}
        {diary.images.map((m, i) => (
          <div
            key={m.id}
            className=""
          >
            <div className="flex items-center gap-4 justify-between">
              <img
                src={ipx(m.url, 'w_512')}
                className="w-32 object-cover aspect-video rounded"
              />
              <div className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (
                      confirm('Are you sure you want to delete this media?')
                    ) {
                      deleteMutation.mutate({
                        params: {
                          path: {
                            id: diary.id,
                            imageId: m.id,
                          },
                        },
                      });
                    }
                  }}
                >
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={i === diary.images.length - 1}
                  onClick={() => {
                    const newArr = [...diary.images];
                    const tmp = newArr[i]!;
                    newArr[i] = newArr[i + 1]!;
                    newArr[i + 1] = tmp;
                    updateMutation.mutate({
                      params: {
                        path: {
                          id: diary.id,
                        },
                      },
                      body: {
                        ids: newArr.map((m) => m.id),
                      },
                    });
                  }}
                >
                  <ArrowDownIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={i === 0}
                  onClick={() => {
                    const newArr = [...diary.images];
                    const tmp = newArr[i]!;
                    newArr[i] = newArr[i - 1]!;
                    newArr[i - 1] = tmp;
                    updateMutation.mutate({
                      params: {
                        path: {
                          id: diary.id,
                        },
                      },
                      body: {
                        ids: newArr.map((m) => m.id),
                      },
                    });
                  }}
                >
                  <ArrowUpIcon className="size-4" />
                </Button>
              </div>
            </div>
            {i !== diary.images.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
