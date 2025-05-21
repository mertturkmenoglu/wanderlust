import { Autocomplete } from '@/components/blocks/autocomplete';
import type { AutocompleteItemInfo } from '@/components/blocks/autocomplete/card';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useSearchClient } from '@/hooks/use-search-client';
import { api } from '@/lib/api';
import { formatDate } from 'date-fns';
import { ArrowLeftIcon, MapPinPlusIcon } from 'lucide-react';
import { useState } from 'react';
import { InstantSearch } from 'react-instantsearch';

type Props = {
  day: Date;
  tripId: string;
};

export function AddLocationDialog({ day, tripId }: Props) {
  const searchClient = useSearchClient();
  const [item, setItem] = useState<AutocompleteItemInfo | null>(null);
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState(formatDate(day, "yyyy-MM-dd'T'HH:mm"));
  const invalidator = useInvalidator();
  const [open, setOpen] = useState(false);

  const addLocationMutation = api.useMutation(
    'post',
    '/api/v2/trips/{id}/locations',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        setOpen(false);
      },
    },
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => setOpen(true)}
        >
          <MapPinPlusIcon className="size-4" />
          <span>Add Location</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-h-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Location to Trip</AlertDialogTitle>
          <AlertDialogDescription>
            {item !== null ? (
              <div>
                <Button
                  variant="link"
                  size="sm"
                  className="!px-0"
                  onClick={() => setItem(null)}
                >
                  <ArrowLeftIcon className="size-4" />
                  <span>Go back</span>
                </Button>
                <img
                  src={item.image}
                  alt=""
                  className="aspect-[5/2] w-full rounded-md mt-4 object-cover"
                />
                <div className="mt-4">
                  <div className="text-lg font-semibold leading-none tracking-tight text-black">
                    {item.name}
                  </div>
                  <div className="my-1 line-clamp-1 text-sm text-muted-foreground">
                    {item.city} / {item.state}
                  </div>

                  <div className="text-sm font-semibold leading-none tracking-tight text-primary">
                    {item.categoryName}
                  </div>
                </div>

                <div className="mt-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="You can add a description for this location."
                      value={desc}
                      className="mt-1"
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="scheduledTime">
                      Scheduled Time{' '}
                      <span className="text-destructive-foreground text-xs font-normal -ml-1">
                        *
                      </span>
                    </Label>
                    <Input
                      type="datetime-local"
                      id="scheduledTime"
                      className="mt-1"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <InstantSearch
                indexName="pois"
                searchClient={searchClient}
                routing={false}
                future={{
                  preserveSharedStateOnUnmount: true,
                }}
              >
                <Autocomplete
                  showAdvancedSearch={false}
                  showAllResultsButton={false}
                  isCardClickable={true}
                  onCardClick={(v) => {
                    setItem(v);
                  }}
                />
              </InstantSearch>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-auto">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={item === null || addLocationMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              addLocationMutation.mutate({
                params: {
                  path: {
                    id: tripId,
                  },
                },
                body: {
                  poiId: item?.id ?? '',
                  scheduledTime: new Date(time).toISOString(),
                  description: desc,
                },
              });
            }}
          >
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
