import { Autocomplete } from '@/components/blocks/autocomplete';
import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useSearchClient } from '@/hooks/use-search-client';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';
import Item from './-item';
import { schema } from './-schema';

export const Route = createFileRoute('/diary/$id/edit/locations/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/diary/$id/edit');
  const { diary } = route.useLoaderData();
  const searchClient = useSearchClient();
  const invalidator = useInvalidator();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      locations: diary.locations.map((l) => ({
        id: l.poi.id,
        name: l.poi.name,
        image: l.poi.media[0]?.url ?? '',
        categoryName: l.poi.category.name,
        city: l.poi.address.city.name,
        state: l.poi.address.city.state.name,
        description: l.description,
      })),
    },
  });

  const array = useFieldArray({
    control: form.control,
    name: 'locations',
  });

  const updateDiaryLocationsMutation = api.useMutation(
    'patch',
    '/api/v2/diary/{id}/locations',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Locations updated successfully.');
      },
    },
  );

  const locations = form.watch('locations');

  return (
    <FormProvider {...form}>
      <div className="my-8 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg">Edit Locations</h3>
        </div>

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
              const maxAllowedCount = 32;
              const alreadyInList =
                array.fields.findIndex((lo) => lo.id === v.id) !== -1;

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

              array.append({
                ...v,
                description: '',
              });
            }}
          />
        </InstantSearch>
        <form
          onSubmit={form.handleSubmit(
            (data) => {
              updateDiaryLocationsMutation.mutate({
                params: {
                  path: {
                    id: diary.id,
                  },
                },
                body: {
                  locations: data.locations.map((l) => ({
                    poiId: l.id,
                    description: l.description,
                  })),
                },
              });
            },
            () => {
              toast.error('Failed to update locations');
            },
          )}
        >
          <div className="max-w-4xl mx-auto flex flex-col">
            {locations.length > 0 && (
              <Button
                size="sm"
                disabled={!form.formState.isDirty}
                type="submit"
                className="mt-4 ml-auto"
              >
                Update
              </Button>
            )}
            {locations.length === 0 && (
              <div className="text-sm text-muted-foreground my-8">
                No locations selected
              </div>
            )}
            {locations.map((l, i) => (
              <Item
                index={i}
                key={l.id}
              />
            ))}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
