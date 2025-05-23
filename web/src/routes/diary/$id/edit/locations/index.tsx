import { Autocomplete } from '@/components/blocks/autocomplete';
import { useSearchClient } from '@/hooks/use-search-client';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';
import Item from './-item';
import { schema } from './-schema';

export const Route = createFileRoute('/diary/$id/edit/locations/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/diary/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { entry } = Route.useLoaderData();
  const searchClient = useSearchClient();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      locations: entry.locations.map((l) => ({
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

  return (
    <div className="my-8 max-w-2xl">
      <h3
        className="text-lg"
        id="diary-locations"
      >
        Edit Locations
      </h3>

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
              toast.error(`Maximum ${maxAllowedCount} locations can be added.`);
              return;
            }

            array.append({
              ...v,
              description: '',
            });
          }}
        />
      </InstantSearch>

      <FormProvider {...form}>
        <div className="max-w-4xl mx-auto">
          {array.fields.length === 0 && (
            <div className="text-sm text-muted-foreground my-8">
              No locations selected
            </div>
          )}
          {array.fields.map((l, i) => (
            <Item
              index={i}
              key={l.id}
            />
          ))}
        </div>
      </FormProvider>
    </div>
  );
}
