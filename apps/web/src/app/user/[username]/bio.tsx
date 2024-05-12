"use client";

import { getUserProfile } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

function Bio() {
  const params = useParams<{ username: string }>();

  const query = useQuery({
    queryKey: ["user", params.username],
    queryFn: async () => getUserProfile(params.username),
  });

  return (
    <div>
      <div>
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Bio;
