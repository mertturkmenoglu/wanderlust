import { Link, useLoaderData } from "@remix-run/react";
import { SubmitHandler } from "react-hook-form";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { loader } from "../../route";
import { useStep4Form, useStep4Mutation } from "./hooks";
import OpenTimes from "./open-times";
import { FormInput } from "./schema";

export default function Step4() {
  const { draft } = useLoaderData<typeof loader>();
  const form = useStep4Form(draft);
  const mutation = useStep4Mutation(draft);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">Open Times</h3>

      <form
        className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-2">
          <h3 className="my-4 text-lg font-bold tracking-tight">Open Times</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <OpenTimes day="mon" form={form} />
            <OpenTimes day="tue" form={form} />
            <OpenTimes day="wed" form={form} />
            <OpenTimes day="thu" form={form} />
            <OpenTimes day="fri" form={form} />
            <OpenTimes day="sat" form={form} />
            <OpenTimes day="sun" form={form} />
          </div>
        </div>

        <div>
          <Link
            to={`/dashboard/pois/drafts/${draft.id}?step=3`}
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
