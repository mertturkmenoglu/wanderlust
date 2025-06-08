import { Autocomplete } from '@/components/blocks/autocomplete';
import Spinner from '@/components/kit/spinner';
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
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import {
  ArrowLeftIcon,
  MapPinPlusIcon,
  Settings2Icon,
  Trash2Icon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { InstantSearch } from 'react-instantsearch';

const fmtString = "yyyy-MM-dd'T'HH:mm";

type Props = {
  onOpen?: () => void;
};

export function UpsertLocationDialog({ onOpen }: Props) {
  const route = getRouteApi('/trips/$id');
  const {
    showLocationDialog,
    isUpdate,
    poiId,
    description,
    scheduledTime,
    locId,
  } = route.useSearch();
  const { id: tripId } = route.useParams();
  const searchClient = useSearchClient();
  const invalidator = useInvalidator();
  const navigate = useNavigate();

  const query = api.useQuery(
    'get',
    '/api/v2/pois/{id}',
    {
      params: {
        path: {
          id: poiId ?? '',
        },
      },
    },
    {
      enabled: poiId !== undefined,
      retry: false,
    },
  );

  const [desc, setDesc] = useState('');
  const [time, setTime] = useState(formatDate(new Date(), fmtString));
  const open = showLocationDialog === true;

  useEffect(() => {
    setDesc((prev) => (description !== undefined ? description : prev));
    setTime((prev) =>
      scheduledTime !== undefined ? formatDate(scheduledTime, fmtString) : prev,
    );
  }, [description, scheduledTime]);

  const closeDialog = () => {
    setDesc('');
    setTime(formatDate(new Date(), fmtString));

    navigate({
      to: '.',
      search: () => ({}),
    });
  };

  const openDialog = () => {
    if (onOpen) {
      onOpen();
      return;
    }

    navigate({
      to: '.',
      search: () => ({ showLocationDialog: true }),
    });
  };

  const addLocationMutation = api.useMutation(
    'post',
    '/api/v2/trips/{id}/locations',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        setDesc('');
        setTime(formatDate(new Date(), fmtString));
        closeDialog();
      },
    },
  );

  const updateLocationMutation = api.useMutation(
    'patch',
    '/api/v2/trips/{tripId}/locations/{locationId}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        closeDialog();
      },
    },
  );

  const deleteLocationMutation = api.useMutation(
    'delete',
    '/api/v2/trips/{tripId}/locations/{locationId}',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        closeDialog();
      },
    },
  );

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          openDialog();
          return;
        }
        closeDialog();
      }}
    >
      <AlertDialogTrigger asChild>
        {isUpdate || onOpen ? (
          <Button
            variant="ghost"
            size="icon"
          >
            <Settings2Icon className="size-4" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="ml-auto"
            onClick={() => {
              openDialog();
            }}
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
            {poiId !== undefined ? (
              <div>
                {!isUpdate && (
                  <Button
                    variant="link"
                    size="sm"
                    className="!px-0"
                    onClick={() => {
                      navigate({
                        to: '.',
                        search: (prev) => ({ ...prev, poiId: undefined }),
                      });
                    }}
                  >
                    <ArrowLeftIcon className="size-4" />
                    <span>Go back</span>
                  </Button>
                )}

                {query.isLoading && (
                  <div className="flex items-center justify-center">
                    <Spinner className="mx-auto my-16 size-12" />
                  </div>
                )}

                {query.data && (
                  <>
                    <img
                      src={query.data.poi.images[0]?.url ?? ''}
                      alt=""
                      className="aspect-[5/2] w-full rounded-md mt-4 object-cover"
                    />
                    <div className="mt-4">
                      <div className="text-lg font-semibold leading-none tracking-tight text-black">
                        {query.data.poi.name}
                      </div>
                      <div className="my-1 line-clamp-1 text-sm text-muted-foreground">
                        {query.data.poi.address.city.name} /{' '}
                        {query.data.poi.address.city.country.name}
                      </div>

                      <div className="text-sm font-semibold leading-none tracking-tight text-primary">
                        {query.data.poi.category.name}
                      </div>
                    </div>
                  </>
                )}

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
                    navigate({
                      to: '.',
                      search: (prev) => ({ ...prev, poiId: v.id }),
                    });
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
                  if (!locId) {
                    return;
                  }
                  deleteLocationMutation.mutate({
                    params: {
                      path: {
                        tripId,
                        locationId: locId,
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
            disabled={poiId === undefined || addLocationMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              if (isUpdate && locId !== undefined) {
                updateLocationMutation.mutate({
                  params: {
                    path: {
                      tripId,
                      locationId: locId,
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
                    poiId: poiId ?? '',
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
