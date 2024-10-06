import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { Separator } from "~/components/ui/separator";
import { getDraft } from "~/lib/api-requests";
import DeleteDialog from "./delete-dialog";
import StepsIndicator from "./steps-indicator";
import Step1 from "./__steps/step-1";
import Step2 from "./__steps/step-2";
import Step3 from "./__steps/step-3";
import Step4 from "./__steps/step-4";
import Step5 from "./__steps/step-5";
import Step6 from "./__steps/step-6";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const baseApiUrl = import.meta.env.VITE_API_URL ?? "";

  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const draft = await getDraft(params.id, { headers: { Cookie } });
    return json({ draft: draft.data, baseApiUrl });
  } catch (e) {
    throw new Response("Something went wrong", { status: 500 });
  }
}
export default function Page() {
  const { draft } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const step = params.get("step") ?? "1";

  return (
    <div className="mx-auto">
      <BackLink
        href="/dashboard/pois/drafts"
        text="Go back to the drafts page"
      />
      <div className="flex items-end gap-8 mt-4">
        <h2 className="text-4xl font-bold tracking-tight">
          {draft.name ?? "Unnamed Draft"}
        </h2>
        <DeleteDialog id={draft.id} />
      </div>

      <Separator className="my-4" />

      <StepsIndicator draftId={draft.id} />

      {step === "1" && <Step1 />}
      {step === "2" && <Step2 />}
      {step === "3" && <Step3 />}
      {step === "4" && <Step4 />}
      {step === "5" && <Step5 />}
      {step === "6" && <Step6 />}
    </div>
  );
}
