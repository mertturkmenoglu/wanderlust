import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useQuery } from "@tanstack/react-query";
import { getMe, getUserBookmarks } from "~/lib/api";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const auth = await getMe({ headers: { Cookie } });

    if (!auth.data || auth.data.role !== "admin") {
      throw redirect("/");
    }

    return json({ isAuthenticated: true }); // I don't know what to return, just returning bool for now.
  } catch (e) {
    throw redirect("/");
  }
}

export function meta() {
  return [{ title: "Bookmarks | Wanderlust" }];
}

export default function Page() {
  const query = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => getUserBookmarks(1, 10),
  });

  return (
    <div className="container mx-auto my-16">
      <div>This is the bookmarks page</div>
      <pre>{JSON.stringify(query.data ?? {}, null, 2)}</pre>
    </div>
  );
}
