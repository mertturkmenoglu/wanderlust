"use client";

import { useIsThisUser } from "@/hooks/useIsThisUser";
import { api, rpc } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

function Bio() {
  const params = useParams<{ username: string }>();
  const isThisUser = useIsThisUser(params.username);

  const query = useQuery({
    queryKey: ["user", params.username],
    queryFn: async () =>
      rpc(() =>
        api.users[":username"].profile.$get({
          param: { username: params.username },
        })
      ),
  });

  return (
    <div>
      <div>
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
        {isThisUser && <Link href="/settings">Settings</Link>}
      </div>
    </div>
  );
}

export default Bio;
