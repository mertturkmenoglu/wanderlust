import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Separator } from "~/components/ui/separator";
import { getMe } from "~/lib/api-requests";
import CreateListDialog from "./create-list-dialog";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const auth = await getMe({ headers: { Cookie } });

    if (!auth.data) {
      throw redirect("/");
    }

    return json({ auth: auth.data });
  } catch (e) {
    throw redirect("/");
  }
}

export function meta() {
  return [{ title: "Lists | Wanderlust" }];
}

export default function Page() {
  return (
    <div className="container my-8 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Lists</h2>
        <CreateListDialog />
      </div>

      <Separator className="my-4" />
    </div>
  );
}
