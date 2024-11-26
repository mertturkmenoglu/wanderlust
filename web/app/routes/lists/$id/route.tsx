import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useContext } from "react";
import {
  data,
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from "react-router";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import AppMessage from "~/components/blocks/app-message";
import BackLink from "~/components/blocks/back-link";
import PoiCard from "~/components/blocks/poi-card";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { deleteListById, getListById } from "~/lib/api-requests";
import { getCookiesFromRequest } from "~/lib/cookies";
import { AuthContext } from "~/providers/auth-provider";
import type { Route } from "./+types/route";

export async function loader({ params, request }: Route.LoaderArgs) {
  invariant(params.id, "id is required");

  try {
    const res = await getListById(params.id, {
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    return { list: res.data };
  } catch (e) {
    const status = (e as any)?.response?.status;
    if (status === 401 || status === 403) {
      throw data("You do not have permissions to view this list", {
        status: 403,
      });
    } else if (status === 404) {
      throw data("List not found", { status: 404 });
    } else {
      throw data("Something went wrong", { status: status ?? 500 });
    }
  }
}

export function meta({ data, error }: Route.MetaArgs): Route.MetaDescriptors {
  if (error) {
    return [{ title: "Error | Wanderlust" }];
  }

  if (data) {
    return [{ title: `${data.list.name} | Wanderlust` }];
  }

  return [{ title: "Lists | Wanderlust" }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { list } = loaderData;
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isOwner = auth.user?.data?.id === list.userId;

  const deleteMutation = useMutation({
    mutationKey: ["delete-list", list.id],
    mutationFn: () => deleteListById(list.id),
    onSuccess: () => {
      toast.success("List is deleted.");
      qc.invalidateQueries({ queryKey: ["lists"] });
      navigate("/lists");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink href="/lists" text="Go back to lists" />
      <div className="flex justify-between items-center gap-8">
        <div>
          <h2 className="text-2xl tracking-tighter">{list.name}</h2>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <div>Created by: {list.user.fullName}</div>
            <div>{new Date(list.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="text-xs text-muted-foreground mt-1"></div>
        </div>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <EllipsisVerticalIcon className="" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  to={`/report?type=list&resourceId=${list.id}`}
                  className="flex items-center gap-2 w-full"
                >
                  <FlagIcon className="size-3" />
                  <div className="text-sm">Report</div>
                </Link>
              </DropdownMenuItem>

              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      to={`/lists/${list.id}/edit`}
                      className="flex items-center gap-2 w-full"
                    >
                      <PencilIcon className="size-3" />
                      <div className="text-sm">Edit</div>
                    </Link>
                  </DropdownMenuItem>

                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <button className="flex items-center gap-2 w-full text-destructive">
                        <TrashIcon className="size-3" />
                        <div className="text-sm">Delete</div>
                      </button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 text-sm">
              Are you sure you want to delete this list? This action cannot be
              undone and all data will be permanently deleted.
            </div>
            <DialogFooter className="">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-2" />

      {list.items.length === 0 && (
        <AppMessage
          emptyMessage="This list is empty"
          className="my-16"
          backLink="/lists"
          backLinkText="Go back to the lists page"
        />
      )}

      {list.items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.items.map((listItem) => (
            <Link to={`/p/${listItem.poiId}`} key={listItem.poiId}>
              <PoiCard
                poi={{
                  ...listItem.poi,
                  image: {
                    url: listItem.poi.firstMedia.url,
                    alt: listItem.poi.firstMedia.alt,
                  },
                }}
              />
            </Link>
          ))}
        </div>
      )}
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
