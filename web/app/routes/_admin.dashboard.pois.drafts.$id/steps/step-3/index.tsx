import { Link, useLoaderData } from "@remix-run/react";
import { Controller, SubmitHandler } from "react-hook-form";
import InputError from "~/components/kit/input-error";
import { Button, buttonVariants } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { useAmenities } from "~/hooks/use-amenities";
import { cn } from "~/lib/utils";
import { loader } from "../../route";
import { useStep3Form, useStep3Mutation } from "./hooks";
import { FormInput } from "./schema";

export default function Step3() {
  const { draft } = useLoaderData<typeof loader>();
  const form = useStep3Form(draft);
  const mutation = useStep3Mutation(draft);
  const qAmenities = useAmenities();

  if (!qAmenities.data || !qAmenities.data.data.amenities) {
    return <></>;
  }

  const amenities = qAmenities.data.data.amenities;

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">Amenities</h3>

      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Controller
            name="amenities"
            control={form.control}
            render={() => {
              return (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-2">
                  {amenities.map((amenity) => (
                    <Controller
                      key={amenity.id}
                      control={form.control}
                      name="amenities"
                      render={({ field }) => {
                        return (
                          <div className="flex items-center gap-1">
                            <Checkbox
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      amenity.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== amenity.id
                                      )
                                    );
                              }}
                            />

                            <Label className="font-normal">
                              {amenity.name}
                            </Label>
                          </div>
                        );
                      }}
                    />
                  ))}
                </div>
              );
            }}
          />
          <InputError error={form.formState.errors.amenities?.root} />
        </div>

        <div>
          <Link
            to={`/dashboard/pois/drafts/${draft.id}?step=2`}
            className={cn(
              "block w-full",
              buttonVariants({ variant: "default" })
            )}
          >
            Previous
          </Link>
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
