import { LoaderFunctionArgs, MetaFunction, redirect } from "react-router";
import { Link, Outlet } from "react-router";
import { getMe } from "~/lib/api";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const Cookie = request.headers.get("Cookie") ?? "";
    const auth = await getMe({ headers: { Cookie } });

    if (!auth.data || auth.data.role !== "admin") {
      throw redirect("/");
    }

    return { auth: auth.data };
  } catch (e) {
    throw redirect("/");
  }
}

export const meta: MetaFunction = () => {
  return [{ title: "Admin Dashboard | Wanderlust" }];
};

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
