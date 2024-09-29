import { useLoaderData } from "@remix-run/react";
import { Controller, SubmitHandler } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useCategories } from "~/hooks/use-categories";
import { loader } from "../../route";
import { useStep1Form, useStep1Mutation } from "./hooks";
import { FormInput } from "./schema";

export default function Step1() {
  const { draft } = useLoaderData<typeof loader>();
  const form = useStep1Form(draft);
  const qCategories = useCategories();
  const mutation = useStep1Mutation(draft);

  if (!qCategories.data || !qCategories.data.data.categories) {
    return <></>;
  }

  const categories = qCategories.data.data.categories;

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">Basic Info</h3>

      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="">
          <Label htmlFor="id">Draft ID</Label>
          <Input type="text" id="id" disabled={true} value={draft.id} />
          <InputInfo text="You cannot change the draft id" />
        </div>

        <div className="">
          <Label htmlFor="draft-version">Draft Version</Label>
          <Input
            type="text"
            id="draft-version"
            disabled={true}
            value={draft.v}
          />
          <InputInfo text="You cannot change the draft version" />
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
          <InputInfo text="Name of the point of interest" />
          <InputError error={form.formState.errors.name} />
        </div>

        <div></div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description of the point of interest"
            rows={4}
            autoComplete="off"
            {...form.register("description")}
          />
          <InputInfo text="Description of the point of interest" />
          <InputError error={form.formState.errors.description} />
        </div>

        <div className="">
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            placeholder="+1 (000) 000 0000"
            autoComplete="tel"
            {...form.register("phone")}
          />
          <InputInfo text="Phone number" />
          <InputError error={form.formState.errors.phone} />
        </div>

        <div className="">
          <Label htmlFor="website">Website</Label>
          <Input
            type="url"
            id="website"
            placeholder="https://example.com"
            autoComplete="off"
            {...form.register("website")}
          />
          <InputInfo text="Website address" />
          <InputError error={form.formState.errors.website} />
        </div>

        <div className="">
          <Label htmlFor="accessibility-level">Accessibility Level</Label>
          <Controller
            name="accessibilityLevel"
            control={form.control}
            defaultValue={draft.accessibilityLevel}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <SelectTrigger id="accessibility-level">
                    <SelectValue placeholder="Accessibility Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose an accessibility level" />
          <InputError error={form.formState.errors.accessibilityLevel} />
        </div>

        <div className="">
          <Label htmlFor="price-level">Price Level</Label>
          <Controller
            name="priceLevel"
            control={form.control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <SelectTrigger id="price-level">
                    <SelectValue placeholder="Price Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose a price level" />
          <InputError error={form.formState.errors.priceLevel} />
        </div>

        <div className="">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(str) => field.onChange(+str)}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <InputInfo text="Choose a category" />
          <InputError error={form.formState.errors.categoryId} />
        </div>

        <div></div>

        <div>
          <Button type="button" className="block w-full" disabled={true}>
            Previous
          </Button>
        </div>

        <div>
          <Button type="submit" className="block w-full">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
