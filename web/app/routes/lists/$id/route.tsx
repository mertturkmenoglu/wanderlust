import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import { getListById } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = getCookiesFromRequest(request);
    const res = await getListById(params.id, { headers: { Cookie } });
    return json({ list: res.data });
  } catch (e) {
    const status = (e as any)?.response?.status;
    if (status === 401 || status === 403) {
      throw json("You do not have permissions to view this list", {
        status: 403,
      });
    } else if (status === 404) {
      throw json("List not found", { status: 404 });
    } else {
      throw json("Something went wrong", { status: status ?? 500 });
    }
  }
}

export function meta({ data, error }: MetaArgs<typeof loader>) {
  if (error) {
    return [{ title: "Error | Wanderlust" }];
  }

  if (data) {
    return [{ title: `${data.list.name} | Wanderlust` }];
  }

  return [{ title: "Lists | Wanderlust" }];
}

export default function Page() {
  return (
    <div>
      <div>List details page</div>
    </div>
  );
}
