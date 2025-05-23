import { Autocomplete } from '@/components/blocks/autocomplete';
import { Card } from '@/components/ui/card';
import { useSearchClient } from '@/hooks/use-search-client';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z
  .object({
    locations: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        categoryName: z.string(),
        city: z.string(),
        state: z.string(),
        description: z.string().max(256).nullable(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const ids = new Set(data.locations.map((l) => l.id));
    if (ids.size !== data.locations.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Location IDs must be unique',
        path: ['locations'],
        fatal: true,
      });

      return z.NEVER;
    }
  });

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function ActionButton({
  children,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function LocationsEdit() {
  // const route = getRouteApi('/diary/$id/edit/');
  // const { entry } = route.useLoaderData();
  const searchClient = useSearchClient();

  // const form = useForm({
  //   resolver: zodResolver(schema),
  //   defaultValues: {
  //     locations: entry.locations.map((l) => ({
  //       id: l.poi.id,
  //       name: l.poi.name,
  //       image: l.poi.media[0]?.url ?? '',
  //       categoryName: l.poi.category.name,
  //       city: l.poi.address.city.name,
  //       state: l.poi.address.city.state.name,
  //       description: l.description,
  //     })),
  //   },
  // });

  const array = useFieldArray({
    control: form.control,
    name: 'locations',
  });

  return (
    <div>
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

      <div className="max-w-4xl mx-auto">
        {array.fields.length === 0 && (
          <div className="text-center text-sm text-muted-foreground my-8">
            No locations selected
          </div>
        )}
        {array.fields.map((l, i) => (
          <div
            key={l.id}
            className="flex flex-col"
          >
            <Card className="mt-4 flex gap-8 p-4 flex-1">
              <img
                src={l.image}
                alt=""
                className="aspect-video w-48 rounded-lg object-cover"
              />

              <div>
                <div className="line-clamp-1 text-lg font-semibold capitalize leading-none tracking-tight">
                  {l.name}
                </div>
                <div className="my-1 line-clamp-1 text-sm text-muted-foreground">
                  {l.city} / {l.state}
                </div>

                <div className="text-sm font-semibold leading-none tracking-tight text-primary">
                  {l.categoryName}
                </div>
              </div>
            </Card>

            <div className="ml-auto mt-1">
              {/* <EditDialog
                form={form}
                name={l.name}
                index={i}
              /> */}

              <ActionButton
                disabled={i === 0}
                onClick={() => array.swap(i, i - 1)}
              >
                <ArrowUpIcon className="size-3" />
                <span className="sr-only">Move {l.name} up</span>
              </ActionButton>
              <ActionButton
                disabled={i === array.fields.length - 1}
                onClick={() => array.swap(i, i + 1)}
              >
                <ArrowDownIcon className="size-3" />
                <span className="sr-only">Move {l.name} down</span>
              </ActionButton>
              <ActionButton onClick={() => array.remove(i)}>
                <XIcon className="size-3" />
                <span className="sr-only">Remove {l.name}</span>
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
