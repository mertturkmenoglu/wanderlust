import { LoaderFunctionArgs, redirect, SerializeFrom } from "react-router";
import { Link, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getCollectionById } from "~/lib/api-requests";
import { GetCollectionByIdResponseDto } from "~/lib/dto";
import { ipx } from "~/lib/img-proxy";
import DeleteDialog from "../../__components/delete-dialog";
import { useDeleteCollectionMutation } from "./hooks";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const collection = await getCollectionById(params.id, {
      headers: { Cookie },
    });
    return { collection: collection.data };
  } catch (e) {
    throw redirect("/");
  }
}

function getImage(collection: SerializeFrom<GetCollectionByIdResponseDto>): {
  url: string;
  alt: string;
} {
  const img = collection.items[0]?.poi.firstMedia;

  if (!img) {
    return {
      url: "",
      alt: "",
    };
  }

  return {
    url: img.url,
    alt: img.alt,
  };
}

export default function Page() {
  const { collection } = useLoaderData<typeof loader>();
  const mutation = useDeleteCollectionMutation(collection.id);
  const img = getImage(collection);

  return (
    <>
      <BackLink
        href="/dashboard/collections"
        text="Go back to collections page"
      />

      {img.url !== "" && (
        <img
          src={ipx(img.url, "w_512")}
          alt={img.alt}
          className="mt-4 w-64 rounded-md aspect-video object-cover"
        />
      )}

      <h2 className="text-4xl font-bold mt-4">{collection.name}</h2>

      <div className="flex flex-row gap-2 w-min items-start mt-4">
        <Button variant="outline" asChild>
          <Link to={`/c/${collection.id}`}>Visit Page</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to={`/dashboard/collections/${collection.id}/edit`}>Edit</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to={`/dashboard/collections/${collection.id}/items`}>
            See Collection Items
          </Link>
        </Button>

        <DeleteDialog type="collection" onClick={() => mutation.mutate()} />
      </div>

      <Separator className="my-4 max-w-md" />

      <h3 className="mt-4 text-lg font-bold tracking-tight">Short Info</h3>

      <div className="grid grid-cols-12 gap-2 mt-4">
        <div className="font-semibold col-span-1">Id:</div>
        <div className="col-span-11">{collection.id}</div>

        <div className="font-semibold col-span-1">Name:</div>
        <div className="col-span-11">{collection.name}</div>

        <div className="font-semibold col-span-1">Description:</div>
        <div className="col-span-11">{collection.description}</div>

        <div className="font-semibold col-span-1">Created At:</div>
        <div className="col-span-11">
          {new Date(collection.createdAt).toLocaleString()}
        </div>
      </div>
    </>
  );
}
