import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";

export const schema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
});

export type FormInput = z.infer<typeof schema>;

export function useNewAmenityForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export default function Page() {
  const form = useNewAmenityForm();

  return (
    <div>
      <h3 className="mb-8 text-lg font-bold tracking-tight">
        Create New Amenity
      </h3>
      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(console.log)}
      >
        <div className="">
          <Label htmlFor="id">ID</Label>
          <Input
            type="number"
            id="id"
            placeholder="ID of the amenity"
            autoComplete="off"
            {...form.register("id")}
          />
          <InputInfo text="ID of the amenity" />
          <InputError error={form.formState.errors.id} />
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
          <InputInfo text="Name" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
}
