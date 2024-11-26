import { data } from "react-router";
import invariant from "tiny-invariant";
import BackLink from "~/components/blocks/back-link";
import { getListById, getMe } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";

export async function loader({ params, request }: Route.LoaderArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = getCookiesFromRequest(request);
    const auth = await getMe({ headers: { Cookie } });
    const list = await getListById(params.id, { headers: { Cookie } });

    if (!list.data) {
      throw data("List not found", {
        status: 404,
      });
    }

    if (!auth.data) {
      throw data("You are not signed in", {
        status: 401,
      });
    }

    if (list.data.userId !== auth.data.id) {
      throw data("You do not have permission to edit this list", {
        status: 403,
      });
    }

    return { list: list.data };
  } catch (e) {
    let status = (e as any)?.response?.status;

    if (status === undefined) {
      status = (e as any)?.status;
    }

    if (status === 401) {
      throw data("You are not signed in", {
        status: 401,
      });
    } else if (status === 403) {
      throw data("You do not have permission to edit this list", {
        status: 403,
      });
    } else if (status === 404) {
      throw data("List not found", {
        status: 404,
      });
    } else {
      throw data("Something went wrong", {
        status: status ?? 500,
      });
    }
  }
}

export function meta({ data, error }: Route.MetaArgs): Route.MetaDescriptors {
  if (error) {
    return [{ title: "Error | Wanderlust" }];
  }

  if (data) {
    return [{ title: `Edit ${data.list.name} | Wanderlust` }];
  }

  return [{ title: "Lists | Wanderlust" }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { list } = loaderData;

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink
        href={`/lists/${list.id}`}
        text="Go back to the edit list page"
      />
      <div>
        <div>This is the edit list items page</div>
      </div>
    </div>
  );
}
