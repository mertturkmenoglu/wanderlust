import { redirect } from "react-router";
import { createDraft } from "~/lib/api-requests";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const res = await createDraft({ headers: { Cookie } });
    redirect(`/dashboard/pois/drafts/${res.data.id}`);
  } catch (e) {
    throw new Response("Something went wrong", { status: 500 });
  }
}
