import { Autocomplete } from '@/components/blocks/autocomplete';
import { PoiCard } from '@/components/blocks/poi-card';
import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useSearchClient } from '@/hooks/use-search-client';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi, Link } from '@tanstack/react-router';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Settings2Icon,
  XIcon,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';

type Props = {
  className?: string;
};

export function FavoriteLocations({ className }: Props) {
  const rootRoute = getRouteApi('/u/$username');
  const route = getRouteApi('/u/$username/');
  const { profile } = rootRoute.useLoaderData();
  const { pois } = route.useLoaderData();
  const invalidator = useInvalidator();
  const searchClient = useSearchClient();

  const form = useForm({
    defaultValues: {
      pois,
    },
  });

  const array = useFieldArray({
    control: form.control,
    name: 'pois',
  });

  useEffect(() => {
    form.setValue('pois', pois);
  }, [pois, form]);

  const [isEditMode, setIsEditMode] = useState(false);

  const auth = useContext(AuthContext);
  const isThisUser = auth.user?.username === profile.username;

  const updateTopPoisMutation = api.useMutation('patch', '/api/v2/users/top', {
    onSuccess: async () => {
      await invalidator.invalidate();
      toast.success('Successfully updated favorite locations');
      setIsEditMode(false);
    },
  });

  return (
    <div className={cn(className)}>
      <div className="text-2xl font-medium">
        <span>Favorite Locations</span>
        {isThisUser && (
          <Button
            variant="ghost"
            className="ml-2"
            onClick={() => setIsEditMode((prev) => !prev)}
          >
            <span className="sr-only">Edit</span>
            <Settings2Icon className="size-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {isEditMode && (
          <div className="flex items-center gap-2 col-span-full">
            <Button
              onClick={(e) => {
                e.preventDefault();
                updateTopPoisMutation.mutate({
                  body: {
                    poiIds: form.getValues('pois').map((poi) => poi.id),
                  },
                });
              }}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setIsEditMode(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        {isEditMode && form.watch('pois').length < 4 && (
          <div className="col-span-2">
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
                isCardClickable
                onCardClick={(v) => {
                  const maxAllowedCount = 4;
                  const alreadyInList = array.fields.some(
                    (lo) => lo.id === v.id,
                  );

                  if (alreadyInList) {
                    toast.error('Location is already added.');
                    return;
                  }

                  if (array.fields.length >= maxAllowedCount) {
                    toast.error(
                      `Maximum ${maxAllowedCount} locations can be added.`,
                    );
                    return;
                  }

                  updateTopPoisMutation.mutate({
                    body: {
                      poiIds: [
                        ...form.getValues('pois').map((poi) => poi.id),
                        v.id,
                      ],
                    },
                  });
                }}
              />
            </InstantSearch>
          </div>
        )}

        {form.watch('pois').length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 col-span-full">
            <span className="text-muted-foreground">
              {isThisUser ? 'You' : 'This user'} haven&apos;t added any favorite
              locations yet.
            </span>
          </div>
        )}

        {form.watch('pois').map((poi, i) => (
          <Link
            to="/p/$id"
            key={poi.id}
            className={cn('flex flex-row items-center gap-4 justify-between', {
              'col-span-2': isEditMode,
            })}
            params={{
              id: poi.id,
            }}
          >
            <PoiCard
              key={poi.id}
              poi={poi}
              hoverEffects={!isEditMode}
            />

            {isEditMode && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={i === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    array.swap(i, i - 1);
                  }}
                >
                  <span className="sr-only">Move up</span>
                  <ChevronUpIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={i === form.watch('pois').length - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    array.swap(i, i + 1);
                  }}
                >
                  <span className="sr-only">Move down</span>
                  <ChevronDownIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    array.remove(i);
                  }}
                >
                  <span className="sr-only">Remove</span>
                  <XIcon className="size-4" />
                </Button>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
