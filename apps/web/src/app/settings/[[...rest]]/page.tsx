import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import Org from "./org";
import { auth } from "@clerk/nextjs/server";

function Page() {
  return (
    <div>
      <div>Settings</div>
      <div className="container mx-auto flex justify-center">
        <ClerkLoading>
          <Skeleton className="w-full h-96 bg-muted" />
        </ClerkLoading>
        <ClerkLoaded>
          <div>
            <UserProfile />
            <div className="my-12" />
            {auth().orgId === process.env.CLERK_ADMIN_ORG_ID && <Org />}
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
}

export default Page;
