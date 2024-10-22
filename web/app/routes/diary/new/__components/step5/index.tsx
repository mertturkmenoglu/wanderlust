import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchUserFollowing } from "~/lib/api";
import { FormType } from "../../hooks";
import CardActions from "./card-actions";
import SearchInput from "./search-input";
import SearchResults from "./search-results";
import UserCard from "./user-card";

type Props = {
  form: FormType;
};

export default function Step5({ form }: Props) {
  const [term, setTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const friends = form.watch("friends") ?? [];

  const query = useQuery({
    queryKey: ["search-user-following", term],
    queryFn: async () => {
      return await searchUserFollowing(term);
    },
    enabled: (term?.length ?? 0) >= 4,
  });

  useEffect(() => {
    const len = form.watch("friendSearch")?.length ?? 0;
    if (len < 4) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setTerm(form.watch("friendSearch"));
      setIsLoading(false);
    }, 1000);
  }, [form.watch("friendSearch")]);

  return (
    <div className="w-full mt-16">
      <div className="text-lg text-muted-foreground text-center">
        Have you had any friends with you? Let's add them to your diary.
      </div>
      <div className="mt-16 mx-auto w-full flex items-center">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-8 mx-auto">
          <div className="h-[640px] overflow-y-scroll px-2">
            <SearchInput form={form} />

            <SearchResults
              isLoading={query.isLoading || isLoading}
              form={form}
              results={query.data?.data.friends}
            />
          </div>
          <div className="max-w-xl md:min-w-[640px] h-[640px] overflow-y-scroll px-2">
            {friends.map((friend, i) => (
              <div key={friend.id} className="flex flex-col w-full">
                <UserCard
                  fullName={friend.fullName}
                  username={friend.username}
                  image={friend.profileImage}
                  className="w-full"
                />

                <CardActions
                  className="ml-auto mt-1"
                  index={i}
                  id={friend.id}
                  fullName={friend.fullName}
                  form={form}
                  friends={friends}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
