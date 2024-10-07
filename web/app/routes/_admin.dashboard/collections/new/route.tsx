import { SubmitHandler } from "react-hook-form";
import BackLink from "~/components/blocks/back-link";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useNewCollectionForm, useNewCollectionMutation } from "./hooks";
import { FormInput } from "./schema";

export default function Page() {
  const form = useNewCollectionForm();
  const mutation = useNewCollectionMutation();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <BackLink
        href="/dashboard/collections"
        text="Go back to collections page"
      />
      <h3 className="mb-8 text-lg font-bold tracking-tight">
        Create New Collection
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
          <InputInfo text={(form.watch("name")?.length ?? 0) + "/128"} />
          <InputError error={form.formState.errors.name} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="Description of the collection"
            autoComplete="off"
            rows={6}
            {...form.register("description")}
          />
          <InputInfo
            text={(form.watch("description")?.length ?? 0) + "/1024"}
          />
          <InputError error={form.formState.errors.description} />
        </div>

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
