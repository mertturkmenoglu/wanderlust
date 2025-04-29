import { Outlet, redirect } from "react-router";
import { getMe } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";

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

export function meta({}: Route.MetaArgs): Route.MetaDescriptors {
  return [
    {
      title: "Trips | Wanderlust",
    },
  ];
}

export default function Page() {
  return (
    <div className="my-16 max-w-7xl mx-auto">
      <Outlet />
    </div>
  );
}
