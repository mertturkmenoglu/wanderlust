import { Outlet, redirect } from "react-router";
import { getMe } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import Sidebar from "./__components/sidebar";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const auth = await getMe({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    if (!auth.data) {
      throw redirect("/");
    }

    return { auth: auth.data };
  } catch (e) {
    throw redirect("/");
  }
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "Settings | Wanderlust" }];
}

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-7xl gap-2">
          <h2 className="text-3xl font-semibold">Settings</h2>
        </div>
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Sidebar />
          <div className="grid gap-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
