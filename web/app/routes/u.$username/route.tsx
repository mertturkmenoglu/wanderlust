import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getUserByUsername } from "~/lib/api";
import Bio from "./components/bio";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.username, "username is missing");
  const res = await getUserByUsername(params.username);
  return json({ user: res.data });
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
