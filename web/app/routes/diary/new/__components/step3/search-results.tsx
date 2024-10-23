import { LoaderCircleIcon } from "lucide-react";
import AppMessage from "~/components/blocks/app-message";
import UserImage from "~/components/blocks/user-image";
import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { GetUserProfileResponseDto } from "~/lib/dto";
import { ipx } from "~/lib/img-proxy";
import { cn } from "~/lib/utils";
import { FormType } from "../../hooks";

type Props = {
  isLoading: boolean;
  results: GetUserProfileResponseDto[] | undefined;
  form: FormType;
  className?: string;
};

export default function SearchResults({
  isLoading,
  results,
  form,
  className,
}: Props) {
  return (
    <Card className={cn(className)}>
      {isLoading && (
        <div className="my-8">
          <LoaderCircleIcon className="size-8 animate-spin text-primary mx-auto" />
        </div>
      )}

      {results !== undefined && (
        <div className="m-2">
          {results.length === 0 && !isLoading && (
            <AppMessage
              emptyMessage="No results found"
              showBackButton={false}
              className="my-16"
            />
          )}
          <ScrollArea className="h-64 px-2">
            {results.map((res) => (
              <button
                key={res.id}
                className="flex gap-4 items-center hover:bg-muted p-2 rounded-md w-full"
                onClick={() => {
                  const friends = form.getValues("friends");
                  const alreadyInList =
                    friends.find((lo) => lo.id === res.id) !== undefined;

                  if (alreadyInList) {
                    return;
                  }

                  form.setValue("friends", [
                    ...friends,
                    {
                      id: res.id,
                      username: res.username,
                      fullName: res.fullName,
                      profileImage: res.profileImage,
                    },
                  ]);
                }}
              >
                <UserImage
                  src={ipx(`http://${res.profileImage ?? ""}`, "w_512")}
                  className="size-8"
                />
                <div className="flex flex-col items-start text-sm">
                  <div className="">{res.fullName}</div>
                  <div className="text-muted-foreground text-xs">
                    @{res.username}
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
      )}
    </Card>
  );
}
