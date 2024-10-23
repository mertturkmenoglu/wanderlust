import { ArrowDownIcon, ArrowUpIcon, PencilIcon, XIcon } from "lucide-react";
import { InstantSearch } from "react-instantsearch";
import { ClientOnly } from "remix-utils/client-only";
import { Autocomplete } from "~/components/blocks/autocomplete";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useSearchClient } from "~/hooks/use-search-client";
import { lengthTracker } from "~/lib/form-utils";
import { FormType, useSaveToLocalStorage } from "../../hooks";

type Props = {
  form: FormType;
};

export default function Step2({ form }: Props) {
  const searchClient = useSearchClient();
  const locations = form.watch("locations") ?? [];
  const { saveToLocalStorage } = useSaveToLocalStorage(form);

  const moveItemUp = (id: string) => {
    const index = locations.findIndex((l) => l.id === id);

    if (index <= 0) {
      return;
    }
    const arr = [...locations];
    const tmp = arr[index - 1];
    arr[index - 1] = arr[index];
    arr[index] = tmp;
    form.setValue("locations", arr);
  };

  const moveItemDown = (id: string) => {
    const index = locations.findIndex((l) => l.id === id);

    if (index >= locations.length - 1 || index === -1) {
      return;
    }

    const arr = [...locations];
    const tmp = arr[index + 1];
    arr[index + 1] = arr[index];
    arr[index] = tmp;
    form.setValue("locations", arr);
  };

  const removeItem = (id: string) => {
    const index = locations.findIndex((l) => l.id === id);

    if (index === -1) {
      return;
    }

    const arr = [...locations];
    arr.splice(index, 1);
    form.setValue("locations", arr);
  };

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

                    form.setValue("locations", [
                      ...current,
                      {
                        ...v,
                        description: "",
                      },
                    ]);
                  }}
                />
              </InstantSearch>

              <Separator className="my-8" />

              <h3 className="mt-8 text-lg font-bold tracking-tight">
                Selected Locations
              </h3>
              {locations.length === 0 && (
                <div className="text-center text-sm text-muted-foreground my-8">
                  No locations selected
                </div>
              )}
              {locations.map((l, i) => (
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-1.5 hover:bg-muted rounded-full">
                          <PencilIcon className="size-3" />
                          <span className="sr-only">
                            Edit {l.name} description
                          </span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Description</DialogTitle>
                          <DialogDescription>
                            <div className="text-sm">
                              You can add a short description for this location.
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-2">
                          <div className="">
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              className="col-span-3"
                              placeholder="Add a short description"
                              {...form.register(`locations.${i}.description`)}
                            />
                            <InputInfo
                              text={lengthTracker(
                                form.watch(`locations.${i}.description`),
                                256
                              )}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            onClick={async () => {
                              await saveToLocalStorage();
                            }}
                          >
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <button
                      className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
                      disabled={i === 0}
                      onClick={() => moveItemUp(l.id)}
                    >
                      <ArrowUpIcon className="size-3" />
                      <span className="sr-only">Move {l.name} up</span>
                    </button>
                    <button
                      className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
                      disabled={i === locations.length - 1}
                      onClick={() => moveItemDown(l.id)}
                    >
                      <ArrowDownIcon className="size-3" />
                      <span className="sr-only">Move {l.name} down</span>
                    </button>
                    <button
                      className="p-1.5 hover:bg-muted rounded-full"
                      onClick={() => removeItem(l.id)}
                    >
                      <XIcon className="size-3" />
                      <span className="sr-only">Remove {l.name}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ClientOnly>
      </div>
    </div>
  );
}
