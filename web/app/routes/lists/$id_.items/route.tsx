import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { getListById, getMe } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = getCookiesFromRequest(request);
    const auth = await getMe({ headers: { Cookie } });
    const list = await getListById(params.id);

    if (!list.data) {
      throw json("List not found", {
        status: 404,
      });
    }

    if (!auth.data) {
      throw json("You are not signed in", {
        status: 401,
      });
    }

    if (list.data.userId !== auth.data.id) {
      throw json("You do not have permission to edit this list", {
        status: 403,
      });
    }

    return json({ list: list.data });
  } catch (e) {
    let status = (e as any)?.response?.status;

    if (status === undefined) {
      status = (e as any)?.status;
    }

    if (status === 401) {
      throw json("You are not signed in", {
        status: 401,
      });
    } else if (status === 403) {
      throw json("You do not have permission to edit this list", {
        status: 403,
      });
    } else if (status === 404) {
      throw json("List not found", {
        status: 404,
      });
    } else {
      throw json("Something went wrong", {
        status: status ?? 500,
      });
    }
  }
}

export function meta({ data, error }: MetaArgs<typeof loader>) {
  if (error) {
    return [{ title: "Error | Wanderlust" }];
  }

  if (data) {
    return [{ title: `Edit ${data.list.name} | Wanderlust` }];
  }

  return [{ title: "Lists | Wanderlust" }];
}

export default function Page() {
  const { list } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto my-8">
      <BackLink href="/lists" text="Go back to lists" />
      <div>
        <div>This is the list items page</div>
      </div>
    </div>
  );
}
