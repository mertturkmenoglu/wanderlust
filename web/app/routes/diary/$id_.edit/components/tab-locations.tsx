import { ClientOnly } from "remix-utils/client-only";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InstantSearch } from "react-instantsearch";
import { useSearchClient } from "~/hooks/use-search-client";
import { Autocomplete } from "~/components/blocks/autocomplete";
import { toast } from "sonner";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ArrowDownIcon, ArrowUpIcon, XIcon } from "lucide-react";
import { z } from "zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import ActionButton from "./action-button";
import EditDialog from "./locations-edit-dialog";

const schema = z.object({
  locations: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
      categoryName: z.string(),
      city: z.string(),
      state: z.string(),
      description: z.string().max(256).default(""),
    })
  ),
});

export type FormInput = z.infer<typeof schema>;

export default function TabLocations() {
  const { entry } = useLoaderData<typeof loader>();
  const searchClient = useSearchClient();
  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      locations: entry.locations.map((l) => ({
        id: l.poi.id,
        name: l.poi.name,
        image: l.poi.firstMedia.url,
        categoryName: l.poi.category.name,
        city: l.poi.address.city.name,
        state: l.poi.address.city.stateName,
        description: l.description ?? undefined,
      })),
    }
  });
  const { fields, append, swap, remove } = useFieldArray({
    control: form.control,
    name: "locations",
  });

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Edit Entry Locations</CardTitle>
        <CardDescription>
          You can edit your diary entry locations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientOnly fallback={<div>Loading...</div>}>
          {() => (
            <FormProvider {...form}>
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
                      toast.error("Location is already added.");
                      return;
                    }

                    if (fields.length >= maxAllowedCount) {
                      toast.error(
                        `Maximum ${maxAllowedCount} locations can be added.`
                      );
                      return;
                    }

                    append({
                      ...v,
                      description: "",
                    });
                  }}
                />
              </InstantSearch>

              <Separator className="my-8" />

              <h3 className="mt-8 text-lg font-bold tracking-tight">
                Selected Locations
              </h3>
              <ScrollArea className="h-[640px]">
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
                      <EditDialog name={l.name} index={i} />

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
            </FormProvider>
          )}
        </ClientOnly>
      </CardContent>
      <CardFooter>
        <Button>Update</Button>
      </CardFooter>
    </Card>
  );
}
