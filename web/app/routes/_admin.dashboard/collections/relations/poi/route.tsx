import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { LoaderCircleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppMessage from "~/components/blocks/app-message";
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
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  createCollectionPoiRelation,
  getAllPoiCollections,
  removeCollectionPoiRelation,
} from "~/lib/api-requests";

const collectionsPoisQuery = queryOptions({
  queryKey: ["collections-pois"],
  queryFn: async () => getAllPoiCollections(),
});

export default function Page() {
  const [collectionId, setCollectionId] = useState("");
  const [poiId, setPoiId] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["create-collection-poi-relation"],
    mutationFn: () => {
      return createCollectionPoiRelation(collectionId, poiId);
    },
    onSuccess: async () => {
      toast.success("Relation added");
      await qc.invalidateQueries(collectionsPoisQuery);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Collections - Point of Interests Relations
        </h3>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <PlusIcon className="size-4" />
              <span className="ml-2">New</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Add new relation</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  placeholder="Collection ID"
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                />
                <Input
                  placeholder="Poi ID"
                  className="mt-4"
                  value={poiId}
                  onChange={(e) => setPoiId(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button asChild>
                <AlertDialogAction
                  onClick={() => {
                    mutation.mutate();
                  }}
                >
                  Add
                </AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Content />
    </div>
  );
}

function Content() {
  const query = useQuery(collectionsPoisQuery);
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["remove-collection-poi-relation"],
    mutationFn: async ({
      collectionId,
      poiId,
    }: {
      collectionId: string;
      poiId: string;
    }) => removeCollectionPoiRelation(collectionId, poiId),
    onSuccess: async () => {
      toast.success("Relation removed");
      await qc.invalidateQueries(collectionsPoisQuery);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  if (query.error) {
    return <AppMessage errorMessage="Something went wrong" />;
  }

  if (query.data) {
    if (query.data.data.length === 0) {
      return <AppMessage emptyMessage="No data" showBackButton={false} />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        {query.data.data.map((item) => (
          <div
            key={`${item.collectionId}-${item.poiId}`}
            className="border border-border p-6 rounded-md"
          >
            <div>
              <span className="font-bold">Collection ID:</span>
              {item.collectionId}
            </div>
            <div>
              <span className="font-bold">Poi ID:</span>
              {item.poiId}
            </div>
            <div>
              <span className="font-bold">Index:</span>
              {item.index}
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="mt-2"
              onClick={() => {
                mutation.mutate({
                  collectionId: item.collectionId,
                  poiId: item.poiId,
                });
              }}
            >
              <TrashIcon className="size-4" />
              <span className="sr-only">Remove relation</span>
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <LoaderCircleIcon className="mx-auto animate-spin text-primary size-8 my-16" />
  );
}
