import { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { SubmitHandler } from "react-hook-form";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getAmenities } from "~/lib/api";
import { useUpdateAmenityForm, useUpdateAmenityMutation } from "./hooks";
import { FormInput } from "./schema";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const id = +params.id;
  const amenities = await getAmenities();
  const amenity = amenities.data.amenities.find((amenity) => amenity.id === id);

  if (!amenity) {
    throw new Response("Amenity not found", { status: 404 });
  }

  return { amenity };
}

export default function Page() {
  const { amenity } = useLoaderData<typeof loader>();
  const form = useUpdateAmenityForm({
    name: amenity.name,
  });
  const mutation = useUpdateAmenityMutation(amenity.id);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <BackLink
        href={`/dashboard/amenities/${amenity.id}`}
        text="Go back to amenity details"
      />
      <form
        className="max-w-7xl mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            autoComplete="off"
            {...form.register("name")}
          />
          <InputInfo text="Name of the amenity" />
          <InputError error={form.formState.errors.name} />
        </div>
        <div></div>

        <div>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
