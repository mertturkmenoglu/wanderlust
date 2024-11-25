import { LoaderFunctionArgs } from "react-router";
import { Navigate, useLoaderData } from "react-router";
import { createDraft } from "~/lib/api-requests";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const res = await createDraft({ headers: { Cookie } });
    return { draft: res.data };
  } catch (e) {
    throw new Response("Something went wrong", { status: 500 });
  }
}

export default function Page() {
  const { draft } = useLoaderData<typeof loader>();
  return <Navigate to={`/dashboard/pois/drafts/${draft.id}`} replace />;
}
