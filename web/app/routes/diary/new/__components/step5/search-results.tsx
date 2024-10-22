import { LoaderCircleIcon } from "lucide-react";
import AppMessage from "~/components/blocks/app-message";
import UserImage from "~/components/blocks/user-image";
import { GetUserProfileResponseDto } from "~/lib/dto";
import { ipx } from "~/lib/img-proxy";
import { FormType } from "../../hooks";

type Props = {
  isLoading: boolean;
  results: GetUserProfileResponseDto[] | undefined;
  form: FormType;
};

export default function SearchResults({ isLoading, results, form }: Props) {
  return (
    <>
      {isLoading && (
        <div className="my-8">
          <LoaderCircleIcon className="size-8 animate-spin text-primary mx-auto" />
        </div>
      )}

      {results !== undefined && (
        <div className="my-8">
          {results.length === 0 && (
            <AppMessage
              emptyMessage="No results found"
              showBackButton={false}
              className="my-16"
            />
          )}
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
                className="size-16"
              />
              <div className="flex flex-col items-start">
                <div className="text-lg">{res.fullName}</div>
                <div className="text-muted-foreground text-sm">
                  @{res.username}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
