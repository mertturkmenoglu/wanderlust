import { Link, Outlet, redirect } from "react-router";
import { getMe } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const auth = await getMe({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    if (!auth.data || auth.data.role !== "admin") {
      throw redirect("/");
    }

    return { auth: auth.data };
  } catch (e) {
    throw redirect("/");
  }
}

export function meta({}: Route.MetaArgs): Route.MetaDescriptors {
  return [
    {
      title: "Admin Dashboard | Wanderlust",
    },
  ];
}

export default function Page() {
  return (
    <div className="my-16 max-w-7xl mx-auto">
      <div>
        <Link to="/dashboard">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Admin Dashboard
          </h2>
        </Link>
      </div>
      <div className="my-8 flex flex-col gap-8">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
