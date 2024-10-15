import { InstantSearch } from "react-instantsearch";
import { ClientOnly } from "remix-utils/client-only";
import { Autocomplete } from "~/components/blocks/autocomplete";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useSearchClient } from "~/hooks/use-search-client";
import { FormType } from "./hooks";

type Props = {
  form: FormType;
};

export default function Step2({ form }: Props) {
  const searchClient = useSearchClient();

  return (
    <div className="w-full mt-16">
      <div className="text-lg text-muted-foreground text-center">
        Now let's add the locations you visited.
      </div>
      <div className="max-w-xl mt-16 mx-auto">
        <ClientOnly fallback={<div>Loading...</div>}>
          {() => (
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
                    const current = form.getValues("locations");
                    const alreadyInList =
                      current.findIndex((lo) => lo.id === v.id) !== -1;

                    if (alreadyInList) {
                      return;
                    }

                    form.setValue("locations", [...current, v]);
                  }}
                />
              </InstantSearch>

              <Separator className="my-8" />

              <h3 className="mt-8 text-lg font-bold tracking-tight">
                Selected Locations
              </h3>
              {form.watch("locations").length === 0 && (
                <div className="text-center text-sm text-muted-foreground my-8">
                  No locations selected
                </div>
              )}
              {form.watch("locations").map((l) => (
                <Card key={l.id} className="mt-4 flex gap-8 p-4">
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
              ))}
            </div>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}
