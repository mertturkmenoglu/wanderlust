import PoiCard from '@/components/blocks/poi-card';
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

export default function AddItemDialog({ collectionId, open, setOpen }: Props) {
  const [text, setText] = useState('');
  const [poiId, setPoiId] = useState('');
  const [ok, setOk] = useState(false);
  const invalidator = useInvalidator();

  const query = api.useQuery(
    'get',
    '/api/v2/pois/{id}',
    {
      params: {
        path: {
          id: poiId,
        },
      },
    },
    {
      enabled: poiId !== '',
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
                setPoiId('');
              }}
            />
            <Button
              className="px-0"
              type="button"
              variant="link"
              onClick={() => setPoiId(text)}
            >
              Preview
            </Button>
            {query.isError && (
              <div className="text-xs text-destructive">
                <div>An error happened:</div>
                <pre className="break-words flex-wrap text-wrap whitespace-pre-wrap mt-2">
                  {query.error.title}
                </pre>
              </div>
            )}
            {query.isSuccess && (
              <div>
                <PoiCard
                  poi={{
                    ...query.data.poi,
                    image: {
                      url: query.data.poi.media[0]?.url ?? '',
                      alt: query.data.poi.media[0]?.alt ?? '',
                    },
                  }}
                />
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
                  poiId,
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
