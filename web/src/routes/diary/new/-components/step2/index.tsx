import { Autocomplete } from '@/components/blocks/autocomplete';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useSearchClient } from '@/hooks/use-search-client';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';
import { type FormInput } from '../../-schema';
import ActionButton from './action-button';
import EditDialog from './edit-dialog';

export default function Step2() {
  const form = useFormContext<FormInput>();
  const searchClient = useSearchClient();
  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: 'locations',
  });

  return (
    <div className="w-full mt-4">
      <Label>Now let's add the locations you visited.</Label>
      <div className="max-w-xl mt-4 mx-auto">
        <div>
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
                  fields.findIndex((lo) => lo.id === v.id) !== -1;

                if (alreadyInList) {
                  toast.error('Location is already added.');
                  return;
                }

                if (fields.length >= maxAllowedCount) {
                  toast.error(
                    `Maximum ${maxAllowedCount} locations can be added.`,
                  );
                  return;
                }

                append({
                  ...v,
                  description: '',
                });
              }}
            />
          </InstantSearch>

          <Separator className="my-8" />

          <h3 className="mt-8 text-lg font-bold tracking-tight">
            Selected Locations
          </h3>
          <ScrollArea className="h-[384px]">
            {fields.length === 0 && (
              <div className="text-center text-sm text-muted-foreground my-8">
                No locations selected
              </div>
            )}
            {fields.map((l, i) => (
              <div key={l.id} className="flex flex-col">
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
                  <EditDialog form={form} name={l.name} index={i} />

                  <ActionButton
                    disabled={i === 0}
                    onClick={() => swap(i, i - 1)}
                  >
                    <ArrowUpIcon className="size-3" />
                    <span className="sr-only">Move {l.name} up</span>
                  </ActionButton>
                  <ActionButton
                    disabled={i === fields.length - 1}
                    onClick={() => swap(i, i + 1)}
                  >
                    <ArrowDownIcon className="size-3" />
                    <span className="sr-only">Move {l.name} down</span>
                  </ActionButton>
                  <ActionButton onClick={() => remove(i)}>
                    <XIcon className="size-3" />
                    <span className="sr-only">Remove {l.name}</span>
                  </ActionButton>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
