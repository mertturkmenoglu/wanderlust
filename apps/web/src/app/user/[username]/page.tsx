import { api, rpc } from "@/lib/api";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Bio from "./bio";

type Props = {
  params: {
    username: string;
  };
};

async function Page({ params }: Props) {
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["user", params.username],
    queryFn: async () =>
      rpc(() =>
        api.users[":username"].profile.$get({
          param: {
            username: params.username,
          },
        })
      ),
    staleTime: 2 * 1000,
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(qc)}>
        <Bio />
        <div>Username: {params.username}</div>
      </HydrationBoundary>
    </main>
  );
}

export default Page;
