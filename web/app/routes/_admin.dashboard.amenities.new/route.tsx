import { SubmitHandler } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useNewAmenityForm, useNewAmenityMutation } from "./hooks";
import { FormInput } from "./schema";

export default function Page() {
  const form = useNewAmenityForm();
  const mutation = useNewAmenityMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h3 className="mb-8 text-lg font-bold tracking-tight">
        Create New Amenity
      </h3>
      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
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
          <InputInfo text="Name" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div></div>

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
