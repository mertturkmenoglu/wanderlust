import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getMe } from "~/lib/api";
import Sidebar from "./components/sidebar";

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

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full container gap-2">
          <h2 className="text-3xl font-semibold">Settings</h2>
        </div>
        <div className="mx-auto grid w-full container items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Sidebar />
          <div className="grid gap-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
