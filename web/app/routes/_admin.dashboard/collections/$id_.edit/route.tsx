import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SubmitHandler } from "react-hook-form";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getCollectionById } from "~/lib/api";
import { lengthTracker } from "~/lib/form-utils";
import CustomEditor from "../custom-editor";
import { useUpdateCollectionForm, useUpdateCollectionMutation } from "./hooks";
import { FormInput } from "./schema";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const collection = await getCollectionById(params.id);
  return json({ collection: collection.data });
}

export default function Page() {
  const { collection } = useLoaderData<typeof loader>();
  const form = useUpdateCollectionForm(collection);
  const mutation = useUpdateCollectionMutation(collection.id);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <BackLink
        href={`/dashboard/collections/${collection.id}`}
        text="Go back to collection details"
      />

      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input type="text" id="id" value={collection.id} disabled />
          <InputInfo text="You cannot change the ID of the collection" />
        </div>

        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            autoComplete="off"
            {...form.register("name")}
          />
          <InputInfo text={lengthTracker(form.watch("name"), 128)} />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="desc">Description</Label>
          <ClientOnly fallback={<></>}>
            {() => (
              <CustomEditor
                value={form.watch("description")}
                setValue={(md) => form.setValue("description", md)}
              />
            )}
          </ClientOnly>
          <InputInfo text={lengthTracker(form.watch("description"), 4096)} />
          <InputError error={form.formState.errors.description} />
        </div>

        <div>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
