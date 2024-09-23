import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUserByUsername } from "~/lib/api";
import Bio from "./components/bio";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const username = params.username;

  if (!username) {
    throw new Response("Username is missing", { status: 404 });
  }

  const res = await getUserByUsername(username);

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
    <div className="container mx-auto">
      <Bio className="mt-8 max-w-5xl mx-auto" />
      <Outlet />
    </div>
  );
}
