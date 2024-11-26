import { Outlet, redirect } from "react-router";
import invariant from "tiny-invariant";
import { getUserByUsername } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";
import Bio from "./__components/bio";

export async function loader({ params, request }: Route.LoaderArgs) {
  invariant(params.username, "username is missing");

  try {
    const res = await getUserByUsername(params.username, {
      headers: {
        Cookie: getCookiesFromRequest(request),
      },
    });
    return { user: res.data, meta: res.meta };
  } catch (e) {
    throw redirect("/");
  }
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.user.fullName} | Wanderlust` },
    {
      name: "description",
      content: `${data?.user.fullName} profile page`,
    },
  ];
}

export default function Page() {
  return (
    <div className=" max-w-5xl mx-auto">
      <Bio className="mt-8" />
      <Outlet />
    </div>
  );
}
