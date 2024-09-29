import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { getDraft } from "~/lib/api-requests";
import DeleteDialog from "./delete-dialog";
import Step1 from "./steps/step-1";
import Step2 from "./steps/step-2";
import Step3 from "./steps/step-3";
import Step4 from "./steps/step-4";
import Step5 from "./steps/step-5";

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const draft = await getDraft(params.id, { headers: { Cookie } });
    return json({ draft: draft.data });
  } catch (e) {
    throw new Response("Something went wrong", { status: 500 });
  }
}
export default function Page() {
  const { draft } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const step = params.get("step") ?? "1";

  return (
    <div>
      <BackLink href="/dashboard/pois/drafts" text="Go back to drafts page" />
      <div className="flex items-end gap-4 mt-8">
        <h2 className="text-2xl font-bold tracking-tight">
          {draft.name ?? "Unnamed Draft"}
        </h2>
        <DeleteDialog id={draft.id} />
      </div>

      {step === "1" && <Step1 />}
      {step === "2" && <Step2 />}
      {step === "3" && <Step3 />}
      {step === "4" && <Step4 />}
      {step === "5" && <Step5 />}
    </div>
  );
}
