import { LoaderFunctionArgs, type MetaFunction, redirect } from "react-router";
import { Outlet } from "react-router";
import invariant from "tiny-invariant";
import { getUserByUsername } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import Bio from "./__components/bio";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.username, "username is missing");
  try {
    const Cookie = getCookiesFromRequest(request);
    const res = await getUserByUsername(params.username, {
      headers: { Cookie },
    });
    return { user: res.data, meta: res.meta };
  } catch (e) {
    throw redirect("/");
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.user.fullName} | Wanderlust` },
    {
      name: "description",
      content: `${data?.user.fullName} Wanderlust account`,
    },
  ];
};

export default function Page() {
  return (
    <div className=" max-w-5xl mx-auto">
      <Bio className="mt-8" />
      <Outlet />
    </div>
  );
}
