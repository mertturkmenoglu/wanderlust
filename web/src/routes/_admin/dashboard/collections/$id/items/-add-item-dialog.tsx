import { PlaceCard } from '@/components/blocks/place-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  collectionId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function AddItemDialog({ collectionId, open, setOpen }: Props) {
  const [text, setText] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [ok, setOk] = useState(false);
  const invalidator = useInvalidator();

  const query = api.useQuery(
    'get',
    '/api/v2/places/{id}',
    {
      params: {
        path: {
          id: placeId,
        },
      },
    },
    {
      enabled: placeId !== '',
      retry: false,
    },
  );

  const mutation = api.useMutation('post', '/api/v2/collections/{id}/items', {
    onSuccess: async () => {
      toast.success('Item added to collection');
      await invalidator.invalidate();
      setOpen(false);
    },
  });

  useEffect(() => {
    if (query.isSuccess) {
      setOk(true);
    }

    if (query.isError) {
      setOk(false);
    }
  }, [query.isSuccess, query.isError]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="default">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Collection Item</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-full mt-4">
            <Label htmlFor="poi-id">Poi ID</Label>
            <Input
              type="text"
              id="poi-id"
              placeholder="Poi ID"
              autoComplete="off"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setOk(false);
                setPlaceId('');
              }}
            />
            <Button
              className="px-0"
              type="button"
              variant="link"
              onClick={() => setPlaceId(text)}
            >
              Preview
            </Button>
            {query.isError && (
              <div className="text-xs text-destructive">
                <div>An error happened:</div>
                <pre className="wrap-break-word flex-wrap text-wrap whitespace-pre-wrap mt-2">
                  {query.error.title}
                </pre>
              </div>
            )}
            {query.isSuccess && (
              <div>
                <PlaceCard place={query.data.place} />
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            disabled={!ok}
            onClick={() =>
              mutation.mutate({
                params: {
                  path: {
                    id: collectionId,
                  },
                },
                body: {
                  placeId,
                },
              })
            }
          >
            Add to collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
