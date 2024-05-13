import { getUserProfile } from "@/lib/api";
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
    queryFn: async () => getUserProfile(params.username),
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
