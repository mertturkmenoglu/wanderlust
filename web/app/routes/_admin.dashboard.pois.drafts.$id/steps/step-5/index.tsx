import { useLoaderData } from "@remix-run/react";
import { loader } from "../../route";
import StepsNavigation from "../steps-navigation";

export default function Step5() {
  const { draft } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="mt-8 text-lg font-bold tracking-tight">Media</h3>

      <div className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
        <div className="col-span-2"></div>
        <StepsNavigation draftId={draft.id} step={5} />
      </div>
    </div>
  );
}
