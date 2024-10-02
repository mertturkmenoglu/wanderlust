import { Link, useLoaderData } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Controller, SubmitHandler } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import InputInfo from "~/components/kit/input-info";
import { Button, buttonVariants } from "~/components/ui/button";
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
import { useUpdateDraftMutation } from "../use-update-draft";
import { useStep1Form } from "./hooks";
import { FormInput } from "./schema";

export default function Step1() {
  const { draft } = useLoaderData<typeof loader>();
  const form = useStep1Form(draft);
  const qCategories = useCategories();
  const mutation = useUpdateDraftMutation<FormInput>(draft, "1");

  if (!qCategories.data || !qCategories.data.data.categories) {
    return <></>;
  }

  const categories = qCategories.data.data.categories;

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <form
        className="container mt-8 grid grid-cols-1 gap-4 px-0 max-w-5xl mx-auto md:grid-cols-2"
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
          <InputError error={form.formState.errors.name} />
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
          <InputError error={form.formState.errors.categoryId} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description of the point of interest"
            rows={6}
            autoComplete="off"
            {...form.register("description")}
          />
          <InputInfo text={`${form.watch("description")?.length ?? 0}/512`} />
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
          <InputInfo text="1 is low, 5 is high" />
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
          <InputInfo text="1 is cheap, 5 is expensive" />
          <InputError error={form.formState.errors.priceLevel} />
        </div>

        <div className="flex justify-end">
          <Link
            to={"#"}
            className={buttonVariants({ variant: "secondary", size: "icon" })}
          >
            <ChevronLeftIcon className="size-4" />
          </Link>
        </div>

        <div className="flex justify-start">
          <Button variant="default" size="icon" type="submit">
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
