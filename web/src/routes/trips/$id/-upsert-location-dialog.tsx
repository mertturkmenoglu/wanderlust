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
import {
  ArrowLeftIcon,
  MapPinPlusIcon,
  Settings2Icon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { InstantSearch } from 'react-instantsearch';

type Props = {
  tripId: string;
  initial?: {
    locationId: string;
    item: AutocompleteItemInfo | null;
    desc: string;
    time: string;
  };
};

const fmtString = "yyyy-MM-dd'T'HH:mm";

export function UpsertLocationDialog({ tripId, initial }: Props) {
  const searchClient = useSearchClient();
  const isUpdate = initial !== undefined;
  const [item, setItem] = useState<AutocompleteItemInfo | null>(
    initial?.item ?? null,
  );
  const [desc, setDesc] = useState(initial?.desc ?? '');
  const [time, setTime] = useState(
    formatDate(initial?.time ?? new Date(), fmtString),
  );
  const invalidator = useInvalidator();
  const [open, setOpen] = useState(false);

  const addLocationMutation = api.useMutation(
    'post',
    '/api/v2/trips/{id}/locations',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        setItem(null);
        setDesc('');
        setTime(formatDate(new Date(), fmtString));
        setOpen(false);
      },
    },
  );

  const updateLocationMutation = api.useMutation(
    'patch',
    '/api/v2/trips/{tripId}/locations/{locationId}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        setOpen(false);
      },
    },
  );

  const deleteLocationMutation = api.useMutation(
    'delete',
    '/api/v2/trips/{tripId}/locations/{locationId}',
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
        {isUpdate ? (
          <Button variant="ghost" size="icon">
            <Settings2Icon className="size-4" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="ml-auto"
            onClick={() => setOpen(true)}
          >
            <MapPinPlusIcon className="size-4" />
            <span>Add Location</span>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="min-h-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isUpdate ? 'Update Location' : 'Add Location to Trip'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {item !== null ? (
              <div>
                {!isUpdate && (
                  <Button
                    variant="link"
                    size="sm"
                    className="!px-0"
                    onClick={() => setItem(null)}
                  >
                    <ArrowLeftIcon className="size-4" />
                    <span>Go back</span>
                  </Button>
                )}
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
          {isUpdate && (
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to delete this location?')) {
                  deleteLocationMutation.mutate({
                    params: {
                      path: {
                        tripId,
                        locationId: initial.locationId,
                      },
                    },
                  });
                }
              }}
            >
              <Trash2Icon className="size-4" />
              <span>Delete</span>
            </Button>
          )}
          <AlertDialogCancel className="ml-auto">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={item === null || addLocationMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              if (isUpdate) {
                updateLocationMutation.mutate({
                  params: {
                    path: {
                      tripId,
                      locationId: initial.locationId,
                    },
                  },
                  body: {
                    scheduledTime: new Date(time).toISOString(),
                    description: desc,
                  },
                });
              } else {
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
              }
            }}
          >
            {isUpdate ? 'Update' : 'Add'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
