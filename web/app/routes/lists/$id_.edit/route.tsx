import { json, LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import BackLink from "~/components/blocks/back-link";
import InputInfo from "~/components/kit/input-info";
import { Button, buttonVariants } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getListById, getMe, updateList } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import { cn } from "~/lib/utils";

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const Cookie = getCookiesFromRequest(request);
    const auth = await getMe({ headers: { Cookie } });
    const list = await getListById(params.id, { headers: { Cookie } });

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
      throw json("You do not have permissions to edit this list", {
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
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState(list.name);
  const [isPublic, setIsPublic] = useState(list.isPublic);
  const [isDirty, setIsDirty] = useState(false);
  const isErr = name.length > 128 || name.length < 1;
  const showErr = isDirty && isErr;

  const mutation = useMutation({
    mutationKey: ["list-update", list.id],
    mutationFn: () => updateList(list.id, { name, isPublic }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["lists"] });
      navigate(`/lists/${list.id}`);
      toast.success("List updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink href={`/lists/${list.id}`} text="Go back to the list page" />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl tracking-tighter">Editing: {list.name}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <div>Created by: {list.user.fullName}</div>
            <div>{new Date(list.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <div>
        <Link
          to={`/lists/${list.id}/items`}
          className={cn("my-4", buttonVariants({ variant: "outline" }))}
        >
          Edit List Items
        </Link>
        <div className="space-y-4 max-w-xl">
          <div className="w-full">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              autoComplete="off"
              className="w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
            />
            {showErr && (
              <div className="text-sm text-destructive">
                Name length should be between 1 and 128 characters
              </div>
            )}
          </div>

          <div className="w-full">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(c) => {
                setIsDirty(true);
                setIsPublic(c === true);
              }}
            />
            <Label htmlFor="is-public" className="ml-2">
              Public list
            </Label>
            <InputInfo text="If you make your list public, other users can see it." />
          </div>

          <Button disabled={!isDirty} onClick={() => mutation.mutate()}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <AppMessage
        errorMessage={error.data}
        className="my-32"
        backLink="/lists"
        backLinkText="Go back to the lists page"
      />
    );
  }

  return (
    <AppMessage
      errorMessage={"Something went wrong"}
      className="my-32"
      backLink="/lists"
      backLinkText="Go back to the lists page"
    />
  );
}
